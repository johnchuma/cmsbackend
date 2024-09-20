const { Op } = require("sequelize");
const { Project, Product } = require("../../models");
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
    const response = await Project.findAll({
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
  getProject,
  deleteProject,
  updateProject,
};
