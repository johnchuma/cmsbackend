const { Op } = require("sequelize");
const { Group, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");

const findGroupByUUID = async (uuid) => {
  try {
    const group = await Group.findOne({
      where: {
        uuid,
      },
    });
    return group;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addGroup = async (req, res) => {
  try {
    const { name, church_uuid } = req.body;
    const church = await findChurchByUUID(church_uuid);
    const response = await Group.create({
      name,
      churchId: church.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroups = async (req, res) => {
  try {
    const response = await Group.findAll({
      attributes: {
        exclude: ["id"],
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroup = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    successResponse(res, group);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await group.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateGroup = async (req, res) => {
  try {
    const { uuid } = req.params;
    const group = await findGroupByUUID(uuid);
    const response = await group.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addGroup,
  findGroupByUUID,
  getGroups,
  getGroup,
  deleteGroup,
  updateGroup,
};
