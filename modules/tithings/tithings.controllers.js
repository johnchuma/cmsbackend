const { Op } = require("sequelize");
const { Tithing, Product, Member } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findMemberByUUID } = require("../members/members.controllers");
const { findChurchByUUID } = require("../churches/churches.controllers");

const findTithingByUUID = async (uuid) => {
  try {
    const tithing = await Tithing.findOne({
      where: {
        uuid,
      },
    });
    return tithing;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addTithing = async (req, res) => {
  try {
    const { amount, member_uuid } = req.body;
    const member = await findMemberByUUID(member_uuid);
    const response = await Tithing.create({
      amount,
      memberId: member.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getChurchTithings = async (req, res) => {
  try {
    const { uuid } = req.params;

    const church = await findChurchByUUID(uuid);
    const response = await Tithing.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },

      include: [
        {
          model: Member,
          churchId: church.id,
        },
      ],
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

const getMemberTithings = async (req, res) => {
  try {
    const { uuid } = req.params;
    const member = await findMemberByUUID(uuid);
    const response = await Tithing.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["id"],
      },
      where: {
        memberId: member.id,
      },
      include: [Member],
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

const getTithing = async (req, res) => {
  try {
    const { uuid } = req.params;
    const tithing = await findTithingByUUID(uuid);
    successResponse(res, tithing);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteTithing = async (req, res) => {
  try {
    const { uuid } = req.params;
    const tithing = await findTithingByUUID(uuid);
    const response = await tithing.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateTithing = async (req, res) => {
  try {
    const { uuid } = req.params;
    const tithing = await findTithingByUUID(uuid);
    const response = await tithing.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addTithing,
  findTithingByUUID,
  getChurchTithings,
  getMemberTithings,
  getTithing,
  deleteTithing,
  updateTithing,
};
