const { Op } = require("sequelize");
const { Offering, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findServiceByUUID } = require("../services/services.controllers");

const findOfferingByUUID = async (uuid) => {
  try {
    const offering = await Offering.findOne({
      where: {
        uuid,
      },
    });
    return offering;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addOffering = async (req, res) => {
  try {
    const { name, description, service_uuid } = req.body;
    const service = await findServiceByUUID(service_uuid);
    const response = await Offering.create({
      name,
      description,
      serviceId: service.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getServiceOfferings = async (req, res) => {
  try {
    const { uuid } = req.params;
    const service = await findServiceByUUID(uuid);
    const response = await Offering.findAll({
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

const getOffering = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offering = await findOfferingByUUID(uuid);
    successResponse(res, offering);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteOffering = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offering = await findOfferingByUUID(uuid);
    const response = await offering.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateOffering = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offering = await findOfferingByUUID(uuid);
    const response = await offering.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addOffering,
  findOfferingByUUID,
  getServiceOfferings,
  getOffering,
  deleteOffering,
  updateOffering,
};
