const { Op } = require("sequelize");
const { Pledge, Product, Member, Project, sequelize } = require("../../models");
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
    const response = await Pledge.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
        include: [
          [
            sequelize.literal(
              `(SELECT SUM(amount) FROM Contributions WHERE Contributions.pledgeId = Pledge.id)`
            ),
            "contributedAmount", // Alias for the total sum of contributions for the pledge
          ],
          [
            sequelize.literal(
              `Pledge.amount - COALESCE((SELECT SUM(amount) FROM Contributions WHERE Contributions.pledgeId = Pledge.id), 0)`
            ),
            "remainingAmount", // Alias for the remaining amount after contributions
          ],
        ],
      },
      where: {
        projectId: project.id,
      },
      include: [Member],
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
const getMemberPledges = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Find the member using the provided UUID
    const member = await findMemberByUUID(uuid);

    const response = await Pledge.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["id"],
        include: [
          [
            sequelize.literal(
              `(SELECT SUM(amount) FROM Contributions WHERE Contributions.pledgeId = Pledge.id)`
            ),
            "contributedAmount", // Alias for the total sum of contributions for the pledge
          ],
          [
            sequelize.literal(
              `Pledge.amount - COALESCE((SELECT SUM(amount) FROM Contributions WHERE Contributions.pledgeId = Pledge.id), 0)`
            ),
            "remainingAmount", // Alias for the remaining amount after contributions
          ],
        ],
      },
      where: {
        memberId: member.id,
      },
      include: [Project], // Including related Project information
    });

    // Send success response with paginated results
    successResponse(res, {
      page: req.page,
      count: response.count,
      data: response.rows,
    });
  } catch (error) {
    // Send error response in case of an error
    errorResponse(res, error);
  }
};

const getProjectPledgesReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await findProjectByUUID(uuid);
    const response = await Pledge.findAll({
      attributes: ["createdAt", "amount"],
      where: {
        projectId: project.id,
      },
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
  getProjectPledgesReport,
  getMemberPledges,
  getPledge,
  deletePledge,
  updatePledge,
};
