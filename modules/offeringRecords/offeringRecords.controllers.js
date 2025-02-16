const { Op } = require("sequelize");
const { OfferingRecord, Product,Member } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findOfferingByUUID } = require("../offerings/offerings.controllers");
const { findMemberByUUID } = require("../members/members.controllers");

const findOfferingRecordByUUID = async (uuid) => {
  try {
    const offeringrecord = await OfferingRecord.findOne({
      where: {
        uuid,
      },
    });
    return offeringrecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addOfferingRecord = async (req, res) => {
  try {
    const { amount, offering_uuid,member_uuid } = req.body;
    const offering = await findOfferingByUUID(offering_uuid);
    let payload  = {
      amount,
      offeringId: offering.id,
    }
    if(member_uuid){
      const member  = await findMemberByUUID(member_uuid)
      payload.memberId = member.id;
    }
    const response = await OfferingRecord.create(payload);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOfferingRecords = async (req, res) => {
  try {
    const { uuid } = req.params;
    const {from,to} = req.query;
    const offering = await findOfferingByUUID(uuid);
    let filter = {
      offeringId: offering.id,
    }

    if(from && to){
      filter.createdAt = {
        [Op.between]:[from,to]
      }
    }
    const response = await OfferingRecord.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      include:[Member],
      where: filter,
    });
    const totalOfferings = await OfferingRecord.sum("amount",{
      where:filter
    })
    successResponse(res, {
      page: req.page,
      totalOfferings,
      count: response.count,
      data: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOfferingRecordsReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offering = await findOfferingByUUID(uuid);
    const response = await OfferingRecord.findAll({
      attributes: ["createdAt", "amount"],
      order: [["createdAt"]],
      include:[Member],
      where: {
        offeringId: offering.id,
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOfferingRecord = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offeringrecord = await findOfferingRecordByUUID(uuid);
    successResponse(res, offeringrecord);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteOfferingRecord = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offeringrecord = await findOfferingRecordByUUID(uuid);
    const response = await offeringrecord.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateOfferingRecord = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offeringrecord = await findOfferingRecordByUUID(uuid);
    const response = await offeringrecord.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addOfferingRecord,
  findOfferingRecordByUUID,
  getOfferingRecords,
  getOfferingRecordsReport,
  getOfferingRecord,
  deleteOfferingRecord,
  updateOfferingRecord,
};
