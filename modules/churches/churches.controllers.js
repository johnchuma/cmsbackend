const { Op } = require("sequelize");
const { Church } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");

const findChurchByUUID = async (uuid) => {
  try {
    const church = await Church.findOne({
      where: {
        uuid,
      },
    });
    return church;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addChurch = async (req, res) => {
  try {
    const { name, address, description, user_uuid } = req.body;
    const user = await findUserByUUID(user_uuid);
    const response = await Product.create({
      name,
      address,
      description,
      userId: user.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getChurches = async (req, res) => {
  try {
    const response = await Church.findAll({
      attributes: {
        exclude: ["id"],
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getChurch = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    successResponse(res, church);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteChurch = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    const response = await church.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateChurch = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    const response = await church.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addChurch,
  findChurchByUUID,
  getChurches,
  getChurch,
  deleteChurch,
  updateChurch,
};
