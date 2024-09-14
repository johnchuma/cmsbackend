const { Op } = require("sequelize");
const { GroupMember, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");
const { findMemberByUUID } = require("../members/members.controllers");
const { findGroupByUUID } = require("../group/group.controllers");

const findGroupMemberByUUID = async (uuid) => {
  try {
    const groupmember = await GroupMember.findOne({
      where: {
        uuid,
      },
    });
    return groupmember;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addGroupMember = async (req, res) => {
  try {
    const { member_uuid, group_uuid } = req.body;
    const member = await findMemberByUUID(member_uuid);
    const group = await findGroupByUUID(group_uuid);
    const response = await GroupMember.create({
      memberId: member.id,
      groupId: group.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupMembers = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await GroupMember.findAll({
      attributes: {
        exclude: ["id"],
      },
      where: {
        groupId: group.id,
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupMember = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupmember = await findGroupMemberByUUID(uuid);
    successResponse(res, groupmember);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteGroupMember = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupmember = await findGroupMemberByUUID(uuid);
    const response = await groupmember.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateGroupMember = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupmember = await findGroupMemberByUUID(uuid);
    const response = await groupmember.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addGroupMember,
  findGroupMemberByUUID,
  getGroupMembers,
  getGroupMember,
  deleteGroupMember,
  updateGroupMember,
};
