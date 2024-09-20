const { Op } = require("sequelize");
const { Pledge, Product, Member } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findProjectByUUID } = require("../projects/projects.controllers");
const { findMemberByUUID } = require("../members/members.controllers");

const findPledgeByUUID = async (uuid) => {
  try {
    const pledge = await Pledge.findOne({
      where: {
        uuid,
      },
      include: [Member],
    });
    return pledge;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addPledge = async (req, res) => {
  try {
    const { amount, member_uuid, project_uuid } = req.body;
    const project = await findProjectByUUID(project_uuid);
    const member = await findMemberByUUID(member_uuid);
    const response = await Pledge.create({
      amount,
      memberId: member.id,
      projectId: project.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getProjectPledges = async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await findProjectByUUID(uuid);
    const response = await Pledge.findAll({
      attributes: {
        exclude: ["id"],
      },
      where: {
        projectId: project.id,
      },
      include: [Member],
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getPledge = async (req, res) => {
  try {
    const { uuid } = req.params;
    const pledge = await findPledgeByUUID(uuid);
    successResponse(res, pledge);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deletePledge = async (req, res) => {
  try {
    const { uuid } = req.params;
    const pledge = await findPledgeByUUID(uuid);
    const response = await pledge.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updatePledge = async (req, res) => {
  try {
    const { uuid } = req.params;
    const pledge = await findPledgeByUUID(uuid);
    const response = await pledge.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addPledge,
  findPledgeByUUID,
  getProjectPledges,
  getPledge,
  deletePledge,
  updatePledge,
};
