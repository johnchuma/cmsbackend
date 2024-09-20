const { Op } = require("sequelize");
const { ProjectExpense, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const {
  getProjectByUUID,
  findProjectByUUID,
} = require("../../modules/projects/projects.controllers");

const findProjectExpenseByUUID = async (uuid) => {
  try {
    const projectexpense = await ProjectExpense.findOne({
      where: {
        uuid,
      },
    });
    return projectexpense;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addProjectExpense = async (req, res) => {
  try {
    const { amount, description, project_uuid } = req.body;
    const project = await findProjectByUUID(project_uuid);
    const response = await ProjectExpense.create({
      amount,
      description,
      projectId: project.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getProjectExpenses = async (req, res) => {
  try {
    const { uuid } = req.params;
    const project = await findProjectByUUID(uuid);

    const response = await ProjectExpense.findAll({
      attributes: {
        exclude: ["id"],
      },
      where: {
        projectId: project.id,
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getProjectExpense = async (req, res) => {
  try {
    const { uuid } = req.params;
    const projectexpense = await findProjectExpenseByUUID(uuid);
    successResponse(res, projectexpense);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteProjectExpense = async (req, res) => {
  try {
    const { uuid } = req.params;
    const projectexpense = await findProjectExpenseByUUID(uuid);
    const response = await projectexpense.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProjectExpense = async (req, res) => {
  try {
    const { uuid } = req.params;
    const projectexpense = await findProjectExpenseByUUID(uuid);
    const response = await projectexpense.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addProjectExpense,
  findProjectExpenseByUUID,
  getProjectExpenses,
  getProjectExpense,
  deleteProjectExpense,
  updateProjectExpense,
};
