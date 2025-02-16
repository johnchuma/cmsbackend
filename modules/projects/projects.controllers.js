const { Op } = require("sequelize");
const {
  Project,
  Product,
  Pledge,
  Group,
  Church,
  Contribution,
  sequelize,
} = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findGroupByUUID } = require("../group/group.controllers");

const findProjectByUUID = async (uuid) => {
  try {
    const project = await Project.findOne({
      where: {
        uuid,
      },
      include: [
        {
          model: Group,
          include: [Church],
        },
      ],
    });
    return project;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addProject = async (req, res) => {
  try {
    const { name, description, group_uuid } = req.body;
    const group = await findGroupByUUID(group_uuid);
    const response = await Project.create({
      name,
      description,
      groupId: group.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupProjects = async (req, res) => {
  try {
    const { uuid } = req.params;

    const group = await findGroupByUUID(uuid);
    const response = await Project.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COALESCE(SUM(amount), 0) FROM Pledges WHERE projectId = Project.id)`
            ),
            "pledges", // Alias for the count of members in each group
          ],
          [
            sequelize.literal(
              `(SELECT COALESCE(SUM(amount), 0) FROM Contributions WHERE Contributions.pledgeId IN 
                (SELECT id FROM Pledges WHERE Pledges.projectId = Project.id)
              )`
            ),
            "contributions", // Alias for the total sum of contributions related to the pledges
          ],
        ],
      },
      where: {
        groupId: group.id,
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
const getSingleMemberProjects = async (req, res) => {
  try {
    const member = req.user;

    const response = await Project.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COALESCE(SUM(amount), 0) FROM Pledges WHERE projectId = Project.id)`
            ),
            "pledges", // Alias for the count of members in each group
          ],
          [
            sequelize.literal(
              `(SELECT COALESCE(SUM(amount), 0) FROM Contributions WHERE Contributions.pledgeId IN 
                (SELECT id FROM Pledges WHERE Pledges.projectId = Project.id)
              )`
            ),
            "contributions", // Alias for the total sum of contributions related to the pledges
          ],
        ],
      },
      include: [
        {
          model: Group,
          where: {
            churchId: member.churchId,
          },
          required: true,
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

const getGroupProjectsReport = async (req, res) => {
  try {
    const { uuid } = req.params;

    const group = await findGroupByUUID(uuid);
    const response = await Project.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(
              `(SELECT COALESCE(SUM(amount), 0) FROM Pledges WHERE projectId = Project.id)`
            ),
            "pledges", // Alias for the count of members in each group
          ],
          [
            sequelize.literal(
              `(SELECT COALESCE(SUM(amount), 0) FROM Contributions WHERE Contributions.pledgeId IN 
                (SELECT id FROM Pledges WHERE Pledges.projectId = Project.id)
              )`
            ),
            "contributions", // Alias for the total sum of contributions related to the pledges
          ],
        ],
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

const getProject = async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await findProjectByUUID(uuid);
    successResponse(res, project);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteProject = async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await findProjectByUUID(uuid);
    const response = await project.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProject = async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await findProjectByUUID(uuid);
    const response = await project.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addProject,
  findProjectByUUID,
  getGroupProjects,
  getGroupProjectsReport,
  getSingleMemberProjects,
  getProject,
  deleteProject,
  updateProject,
};
