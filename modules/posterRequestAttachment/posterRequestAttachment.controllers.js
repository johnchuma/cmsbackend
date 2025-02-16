const { Op } = require("sequelize");
const {
  PosterRequestAttachment,
  Product,
  Member,
  Project,
  sequelize,
} = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findProjectByUUID } = require("../projects/projects.controllers");
const { findMemberByUUID } = require("../members/members.controllers");
const { findChurchByUUID } = require("../churches/churches.controllers");
const getUrl = require("../../utils/get_url");
const {
  findPosterRequestByUUID,
} = require("../posterRequests/posterRequests.controllers");

const findPosterRequestAttachmentByUUID = async (uuid) => {
  try {
    const posterrequestattachment = await PosterRequestAttachment.findOne({
      where: {
        uuid,
      },
      include: [Member],
    });
    return posterrequestattachment;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addPosterRequestAttachment = async (req, res) => {
  try {
    const { poster_request_uuid } = req.body;
    const url = await getUrl(req);
    const posterRequest = await findPosterRequestByUUID(poster_request_uuid);
    const response = await PosterRequestAttachment.create({
      url,
      posterRequestId: posterRequest.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getPosterRequestAttachment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterrequestattachment = await findPosterRequestAttachmentByUUID(
      uuid
    );
    successResponse(res, posterrequestattachment);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deletePosterRequestAttachment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterrequestattachment = await findPosterRequestAttachmentByUUID(
      uuid
    );
    const response = await posterrequestattachment.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updatePosterRequestAttachment = async (req, res) => {
  try {
    const { uuid } = req.params;
    const posterrequestattachment = await findPosterRequestAttachmentByUUID(
      uuid
    );
    const response = await posterrequestattachment.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addPosterRequestAttachment,
  findPosterRequestAttachmentByUUID,
  getPosterRequestAttachment,
  deletePosterRequestAttachment,
  updatePosterRequestAttachment,
};
