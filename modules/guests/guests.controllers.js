const { Op } = require("sequelize");
const { Guest, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findServiceByUUID } = require("../services/services.controllers");

const findGuestByUUID = async (uuid) => {
  try {
    const guest = await Guest.findOne({
      where: {
        uuid,
      },
    });
    return guest;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addGuest = async (req, res) => {
  try {
    const { name, description, service_uuid } = req.body;
    const service = await findServiceByUUID(service_uuid);
    const response = await Guest.create({
      name,
      description,
      serviceId: service.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getServiceGuests = async (req, res) => {
  try {
    const { uuid } = req.params;
    const service = await findServiceByUUID(uuid);
    const response = await Guest.findAll({
      attributes: {
        exclude: ["id"],
      },
      where: {
        serviceId: service.id,
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGuest = async (req, res) => {
  try {
    const { uuid } = req.params;
    const guest = await findGuestByUUID(uuid);
    successResponse(res, guest);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteGuest = async (req, res) => {
  try {
    const { uuid } = req.params;
    const guest = await findGuestByUUID(uuid);
    const response = await guest.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateGuest = async (req, res) => {
  try {
    const { uuid } = req.params;
    const guest = await findGuestByUUID(uuid);
    const response = await guest.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addGuest,
  findGuestByUUID,
  getServiceGuests,
  getGuest,
  deleteGuest,
  updateGuest,
};
