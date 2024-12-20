const { Op } = require("sequelize");
const { MemberReport, Church, Member } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");
const { findMemberByUUID } = require("../members/members.controllers");
const { findGroupByUUID } = require("../group/group.controllers");

const findMemberReportByUUID = async (uuid) => {
  try {
    const memberreport = await MemberReport.findOne({
      where: {
        uuid,
      },
    });
    return memberreport;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addMemberReport = async (req, res) => {
  try {
    const { member_uuid, type, description } = req.body;
    const member = await findMemberByUUID(member_uuid);
    const response = await MemberReport.create({
      memberId: member.id,
      type,
      description,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getChurchMemberReports = async (req, res) => {
  try {
    const { uuid } = req.params;

    const church = await findChurchByUUID(uuid);
    const response = await MemberReport.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      include: [
        {
          model: Member,
          where: {
            churchId: church.id,
          },
        },
      ],
    });
    successResponse(res, {
      page: req.page,
      count: response.count,
      data: response.rows,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getMemberReports = async (req, res) => {
  try {
    const { uuid } = req.params;
    const member = await findMemberByUUID(uuid);
    const response = await MemberReport.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        memberId: member.id,
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Member,
        },
      ],
    });
    successResponse(res, {
      page: req.page,
      count: response.count,
      data: response.rows,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getMemberReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const memberreport = await findMemberReportByUUID(uuid);
    successResponse(res, memberreport);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteMemberReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const memberreport = await findMemberReportByUUID(uuid);
    const response = await memberreport.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateMemberReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const memberreport = await findMemberReportByUUID(uuid);
    const response = await memberreport.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addMemberReport,
  findMemberReportByUUID,
  getChurchMemberReports,
  getMemberReport,
  getMemberReports,
  deleteMemberReport,
  updateMemberReport,
};
