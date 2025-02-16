const { Op } = require("sequelize");
const { PosterRequest, Member } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");

const findPosterRequestByUUID = async (uuid) => {
  try {
    const posterrequest = await PosterRequest.findOne({
      where: {
        uuid,
      },
      include: [Member],
    });
    return posterrequest;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addPosterRequest = async (req, res) => {
  try {
    const { description, church_uuid } = req.body;
    const church = await findChurchByUUID(church_uuid);
    const response = await PosterRequest.create({
      description,
      churchId: church.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getChurchPosterRequests = async (req, res) => {
  try {
    const { uuid } = req.params;

    const church = await findChurchByUUID(uuid);
    const response = await PosterRequest.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      where: {
        churchId: church.id,
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

const getPosterRequest = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterrequest = await findPosterRequestByUUID(uuid);
    successResponse(res, posterrequest);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deletePosterRequest = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterrequest = await findPosterRequestByUUID(uuid);
    const response = await posterrequest.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updatePosterRequest = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterrequest = await findPosterRequestByUUID(uuid);
    const response = await posterrequest.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  findPosterRequestByUUID,
  addPosterRequest,
  getChurchPosterRequests,
  getPosterRequest,
  deletePosterRequest,
  updatePosterRequest,
};
