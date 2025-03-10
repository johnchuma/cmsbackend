const { Op } = require("sequelize");
const { Church, Product,Message,Sequelize,SMSInventory } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");

const findChurchByUUID = async (uuid) => {
  try {
    const church = await Church.findOne({
      attributes: {
        exclude:["UserId"],
        include: [
          // Calculate availableSMS as the total number of SMSInventory entries minus the used messages
          [
            Sequelize.literal(`
              (
                SELECT COALESCE(SUM(si.count), 0) 
                FROM SMSInventories AS si 
                WHERE si.churchId = Church.id
              ) 
              - 
              (
                SELECT COUNT(*) 
                FROM Messages AS m 
                LEFT JOIN DeliveryReports AS dr ON m.id = dr.messageId
                WHERE m.churchId = Church.id
                AND dr.id IS NOT NULL
              )
            `),
            'availableSMS'
          ]
          
        ]
      },
      where: {
        uuid: uuid, // Add your filtering condition
      },
      include: [
        {
          model: SMSInventory,
          attributes: [],
        },
        {
          model: Message,
          attributes: [],
        },
      ],
      raw: true, // Optional: Use raw query to avoid Sequelize aliases automatically
    });
    
    return church;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addChurch = async (req, res) => {
  try {
    const { name, address, description } = req.body;
    let user = req.user;
    const response = await Church.create({
      name,
      address,
      description,
      userId: user.id,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getChurches = async (req, res) => {
  try {
    const {keyword} = req.query
    const response = await Church.findAll({
    where:{
      name:{
        [Op.like]:`%${keyword??""}%`
      }
    },
      attributes: {
        exclude: ["id"],
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};


const getUserChurches = async (req, res) => {
  try {
    const user = req.user;
    const church = await Church.findAll({
      where: {
        userId: user.id,
      },
    });
    successResponse(res, church);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getChurch = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    successResponse(res, church);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteChurch = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    const response = await church.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateChurch = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    const response = await church.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addChurch,
  findChurchByUUID,
  getChurches,
  getUserChurches,
  getChurch,
  deleteChurch,
  updateChurch,
};
