const { Op } = require("sequelize");
const { Service, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");
const { findGroupByUUID } = require("../group/group.controllers");

const findServiceByUUID = async (uuid) => {
  try {
    const service = await Service.findOne({
      where: {
        uuid,
      },
    });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addService = async (req, res) => {
  try {
    const { name, description, repetition, date, group_uuid } = req.body;
    const group = await findGroupByUUID(group_uuid);
    const response = await Service.create({
      name,
      description,
      repetition,
      date,
      groupId: group.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getGroupServices = async (req, res) => {
  try {
    const { uuid } = req.params;

    const group = await findGroupByUUID(uuid);
    const response = await Service.findAndCountAll({
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

const getService = async (req, res) => {
  try {
    const { uuid } = req.params;
    const service = await findServiceByUUID(uuid);
    successResponse(res, service);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteService = async (req, res) => {
  try {
    const { uuid } = req.params;
    const service = await findServiceByUUID(uuid);
    const response = await service.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateService = async (req, res) => {
  try {
    const { uuid } = req.params;
    const service = await findServiceByUUID(uuid);
    const response = await service.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addService,
  findServiceByUUID,
  getGroupServices,
  getService,
  deleteService,
  updateService,
};
