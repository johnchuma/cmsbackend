const { Op } = require("sequelize");
const { Attendance, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findServiceByUUID } = require("../services/services.controllers");

const findAttendanceByUUID = async (uuid) => {
  try {
    const attendance = await Attendance.findOne({
      where: {
        uuid,
      },
    });
    return attendance;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addAttendance = async (req, res) => {
  try {
    const { count, service_uuid } = req.body;
    const service = await findServiceByUUID(service_uuid);
    const response = await Attendance.create({
      count,
      serviceId: service.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getServiceAttendances = async (req, res) => {
  try {
    const { uuid } = req.params;

    const service = await findServiceByUUID(uuid);
    const response = await Attendance.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],

      attributes: {
        exclude: ["id"],
      },
      where: {
        serviceId: service.id,
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

const getAttendanceReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const service = await findServiceByUUID(uuid);
    const response = await Attendance.findAll({
      attributes: ["createdAt", "count"],
      where: {
        serviceId: service.id,
      },
      order: [["createdAt"]],
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getAttendance = async (req, res) => {
  try {
    const { uuid } = req.params;
    const attendance = await findAttendanceByUUID(uuid);
    successResponse(res, attendance);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { uuid } = req.params;
    const attendance = await findAttendanceByUUID(uuid);
    const response = await attendance.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateAttendance = async (req, res) => {
  try {
    const { uuid } = req.params;
    const attendance = await findAttendanceByUUID(uuid);
    const response = await attendance.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addAttendance,
  findAttendanceByUUID,
  getServiceAttendances,
  getAttendance,
  getAttendanceReport,
  deleteAttendance,
  updateAttendance,
};
