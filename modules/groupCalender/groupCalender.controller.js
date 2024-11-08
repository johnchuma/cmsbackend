const { Op } = require("sequelize");
const { GroupCalender, Group, Product, sequelize } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findGroupByUUID } = require("../group/group.controllers");
const { findChurchByUUID } = require("../churches/churches.controllers");

const findGroupCalenderByUUID = async (uuid) => {
  try {
    const groupcalender = await GroupCalender.findOne({
      where: {
        uuid,
      },
    });
    return groupcalender;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addGroupCalender = async (req, res) => {
  try {
    const { title, from, to, repetition, description, group_uuid } = req.body;
    const group = await findGroupByUUID(group_uuid);
    const response = await GroupCalender.create({
      title,
      from,
      to,
      repetition,
      description,
      groupId: group.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupCalenders = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await GroupCalender.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
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

const getChurchCalenders = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { filter } = req.query;

    // Get the current date for filtering by month
    let whereClause = {};

    if (filter === "This Month") {
      const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JS
      const currentYear = new Date().getFullYear();
      whereClause = sequelize.where(
        sequelize.fn("MONTH", sequelize.col("GroupCalender.from")),
        currentMonth
      );
      whereClause = sequelize.and(
        whereClause,
        sequelize.where(
          sequelize.fn("YEAR", sequelize.col("GroupCalender.from")),
          currentYear
        )
      );
    }
    console.log(whereClause);
    const church = await findChurchByUUID(uuid);
    const response = await GroupCalender.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      where: whereClause, // Apply where clause for filtering
      include: {
        model: Group,
        where: {
          churchId: church.id,
        },
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

const getGroupCalender = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupcalender = await findGroupCalenderByUUID(uuid);
    successResponse(res, groupcalender);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteGroupCalender = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupcalender = await findGroupCalenderByUUID(uuid);
    const response = await groupcalender.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateGroupCalender = async (req, res) => {
  try {
    const { uuid } = req.params;
    const groupcalender = await findGroupCalenderByUUID(uuid);
    const response = await groupcalender.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addGroupCalender,
  findGroupCalenderByUUID,
  getGroupCalenders,
  getGroupCalender,
  getChurchCalenders,
  deleteGroupCalender,
  updateGroupCalender,
};
