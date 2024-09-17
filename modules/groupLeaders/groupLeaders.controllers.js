const { Op } = require("sequelize");
const { GroupLeader, Product, Member } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");
const { findMemberByUUID } = require("../members/members.controllers");
const { findGroupByUUID } = require("../group/group.controllers");

const findGroupLeaderByUUID = async (uuid) => {
  try {
    const groupleader = await GroupLeader.findOne({
      where: {
        uuid,
      },
      include: [Member],
    });
    return groupleader;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addGroupLeader = async (req, res) => {
  try {
    const { member_uuid, group_uuid, from, position, to } = req.body;
    const member = await findMemberByUUID(member_uuid);
    const group = await findGroupByUUID(group_uuid);
    const response = await GroupLeader.create({
      memberId: member.id,
      groupId: group.id,
      position,
      to,
      from,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getActiveGroupLeaders = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await GroupLeader.findAll({
      where: {
        [Op.and]: [
          {
            groupId: group.id,
          },
          {
            isActive: true,
          },
        ],
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupLeaders = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await GroupLeader.findAll({
      where: {
        groupId: group.id,
      },
      include: [Member],
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getGroupLeader = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupleader = await findGroupLeaderByUUID(uuid);
    successResponse(res, groupleader);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteGroupLeader = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupleader = await findGroupLeaderByUUID(uuid);
    const response = await groupleader.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateGroupLeader = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupleader = await findGroupLeaderByUUID(uuid);
    const response = await groupleader.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addGroupLeader,
  findGroupLeaderByUUID,
  getGroupLeaders,
  getActiveGroupLeaders,
  getGroupLeader,
  deleteGroupLeader,
  updateGroupLeader,
};
