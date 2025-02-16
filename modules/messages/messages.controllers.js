const { Op } = require("sequelize");
const {
  Group,
  GroupMember,
  Member,
  DeliveryReport,
  SMSInventory,
  Message,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const addPrefixToPhoneNumber = require("../../utils/add_number_prefix");
const sendSMS = require("../../utils/send_sms");
const { promise } = require("bcrypt/promises");
const { findChurchByUUID } = require("../churches/churches.controllers");

const buySMS = async (req, res) => {
  try {
    const { church_uuid, count } = req.body;
    const church = await findChurchByUUID(church_uuid);
    const response = await SMSInventory.create({
      churchId: church.id,
      count,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const sendMessages = async (req, res) => {
  try {
    const { recepients, message, church_uuid } = req.body;
    const promises = recepients.map(async (item) => {
      const number = addPrefixToPhoneNumber(item.phone);
      return await sendSMS(number, message);
    });
    const response = await Promise.all(promises);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const sendMessagesToGroup = async (req, res) => {
  try {
    const { message } = req.body;
    const { uuid } = req.params;
    const group = await Group.findOne({
      where: {
        uuid: uuid,
      },
      include: [
        {
          model: GroupMember,
          include: [Member],
        },
      ],
    });
    // extract numbers from response

    let response = { status: false, message: "Group does not exist" };
    if (group) {
      const messageResponse = await Message.create({
        message,
        churchId: group.churchId,
        to: group.name,
      });
      //   console.log(group.GroupMembers.map((item) => item.Member.phone));
      let sendMessagesPromises = group.GroupMembers.map(async (item) => {
        const member = item.Member;
        let smsResponse;
        if (member.phone) {
          smsResponse = await sendSMS(
            addPrefixToPhoneNumber(member.phone),
            message
          );
        }

        return await DeliveryReport.create({
          report:
            smsResponse == null
              ? "No phone number"
              : smsResponse.messages[0].status.description,
          isSent:
            smsResponse == null ? false : smsResponse.messages[0].smsCount == 1,
          memberId: member.id,
          messageId: messageResponse.id,
        });
      });
      response = await Promise.all(sendMessagesPromises);
    }

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = { sendMessagesToGroup, buySMS, sendMessages };
