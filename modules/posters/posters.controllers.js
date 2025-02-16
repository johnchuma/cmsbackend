const { Op } = require("sequelize");
const { Poster, Product, Member, Project, sequelize } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findProjectByUUID } = require("../projects/projects.controllers");
const { findMemberByUUID } = require("../members/members.controllers");
const { findChurchByUUID } = require("../churches/churches.controllers");
const {
  findPosterRequestByUUID,
} = require("../posterRequests/posterRequests.controllers");
const getUrl = require("../../utils/get_url");

const findPosterByUUID = async (uuid) => {
  try {
    const poster = await Poster.findOne({
      where: {
        uuid,
      },
      include: [Member],
    });
    return poster;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addPoster = async (req, res) => {
  try {
    const { poster_request_uuid } = req.body;
    const url = await getUrl(req);
    const posterRequest = await findPosterRequestByUUID(poster_request_uuid);
    const response = await Poster.create({
      url,
      posterRequestId: posterRequest.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getRequestPosters = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterRequest = await findPosterRequestByUUID(uuid);
    const response = await Poster.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      where: {
        posterRequestId: posterRequest.id,
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

const getPoster = async (req, res) => {
  try {
    const { uuid } = req.params;
    const poster = await findPosterByUUID(uuid);
    successResponse(res, poster);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deletePoster = async (req, res) => {
  try {
    const { uuid } = req.params;
    const poster = await findPosterByUUID(uuid);
    const response = await poster.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updatePoster = async (req, res) => {
  try {
    const { uuid } = req.params;
    const poster = await findPosterByUUID(uuid);
    const response = await poster.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addPoster,
  findPosterByUUID,
  getRequestPosters,
  getPoster,
  deletePoster,
  updatePoster,
};
