const { Op } = require("sequelize");
const { Contribution, Product, Pledge, Project } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findPledgeByUUID } = require("../pledges/pledges.controllers");

const findContributionByUUID = async (uuid) => {
  try {
    const contribution = await Contribution.findOne({
      where: {
        uuid,
      },
    });
    return contribution;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addContribution = async (req, res) => {
  try {
    const { amount, pledge_uuid } = req.body;
    const pledge = await findPledgeByUUID(pledge_uuid);
    const response = await Contribution.create({
      amount,
      pledgeId: pledge.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getSingleMemberContributions = async (req, res) => {
  try {
    const member = req.user;
    const response = await Contribution.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      include: [
        {
          model: Pledge,
          where: {
            memberId: member.id,
          },
          required: true,
          include: [Project],
        },
      ],
    });
    successResponse(res, {
      page: req.page,
      count: response.count,
      data: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
const getPledgeContributions = async (req, res) => {
  try {
    const { uuid } = req.params;

    const pledge = await findPledgeByUUID(uuid);
    const response = await Contribution.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      where: {
        pledgeId: pledge.id,
      },
    });
    successResponse(res, {
      page: req.page,
      count: response.count,
      data: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getContribution = async (req, res) => {
  try {
    const { uuid } = req.params;
    const contribution = await findContributionByUUID(uuid);
    successResponse(res, contribution);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteContribution = async (req, res) => {
  try {
    const { uuid } = req.params;
    const contribution = await findContributionByUUID(uuid);
    const response = await contribution.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateContribution = async (req, res) => {
  try {
    const { uuid } = req.params;
    const contribution = await findContributionByUUID(uuid);
    const response = await contribution.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addContribution,
  findContributionByUUID,
  getPledgeContributions,
  getSingleMemberContributions,
  getContribution,
  deleteContribution,
  updateContribution,
};
