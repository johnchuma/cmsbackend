const { Op } = require("sequelize");
const { Group, Product, sequelize } = require("../../models");
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

const getChurchGroups = async (req, res) => {
  try {
    const { uuid } = req.params;

    const church = await findChurchByUUID(uuid);
    const response = await Group.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
        include: [
          [
            sequelize.literal(
              `(SELECT COUNT(*) FROM GroupMembers WHERE GroupMembers.groupId = Group.id)`
            ),
            "members", // Alias for the count of members in each group
          ],
        ],
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
  getChurchGroups,
  getGroup,
  deleteGroup,
  updateGroup,
};
