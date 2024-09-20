const { Op } = require("sequelize");
const { GroupExpense, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findGroupByUUID } = require("../group/group.controllers");

const findGroupExpenseByUUID = async (uuid) => {
  try {
    const groupexpense = await GroupExpense.findOne({
      where: {
        uuid,
      },
    });
    return groupexpense;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addGroupExpense = async (req, res) => {
  try {
    const { amount, description, group_uuid } = req.body;
    const group = await findGroupByUUID(group_uuid);
    const response = await GroupExpense.create({
      amount,
      description,
      groupId: group.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupExpenses = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await GroupExpense.findAll({
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

const getGroupExpense = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupexpense = await findGroupExpenseByUUID(uuid);
    successResponse(res, groupexpense);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteGroupExpense = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupexpense = await findGroupExpenseByUUID(uuid);
    const response = await groupexpense.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateGroupExpense = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupexpense = await findGroupExpenseByUUID(uuid);
    const response = await groupexpense.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addGroupExpense,
  findGroupExpenseByUUID,
  getGroupExpenses,
  getGroupExpense,
  deleteGroupExpense,
  updateGroupExpense,
};
