const { Op } = require("sequelize");
const { OfferingRecord, Product } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findOfferingByUUID } = require("../offerings/offerings.controllers");

const findOfferingRecordByUUID = async (uuid) => {
  try {
    const offeringrecord = await OfferingRecord.findOne({
      where: {
        uuid,
      },
    });
    return offeringrecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addOfferingRecord = async (req, res) => {
  try {
    const { amount, offering_uuid } = req.body;
    const offering = await findOfferingByUUID(offering_uuid);
    const response = await OfferingRecord.create({
      amount,
      offeringId: offering.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOfferingRecords = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offering = await findOfferingByUUID(uuid);
    const response = await OfferingRecord.findAll({
      attributes: {
        exclude: ["id"],
      },
      where: {
        offeringId: offering.id,
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getOfferingRecord = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offeringrecord = await findOfferingRecordByUUID(uuid);
    successResponse(res, offeringrecord);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteOfferingRecord = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offeringrecord = await findOfferingRecordByUUID(uuid);
    const response = await offeringrecord.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateOfferingRecord = async (req, res) => {
  try {
    const { uuid } = req.params;
    const offeringrecord = await findOfferingRecordByUUID(uuid);
    const response = await offeringrecord.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addOfferingRecord,
  findOfferingRecordByUUID,
  getOfferingRecords,
  getOfferingRecord,
  deleteOfferingRecord,
  updateOfferingRecord,
};
