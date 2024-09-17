const { Op } = require("sequelize");
const { Member, User } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const bcrypt = require("bcrypt");
const { findChurchByUUID } = require("../churches/churches.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");

const findMemberByUUID = async (uuid) => {
  try {
    const member = await Member.findOne({
      where: {
        uuid,
      },
    });
    return member;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addMember = async (req, res) => {
  try {
    const {
      name,
      address,
      birthDate,
      church_uuid,
      disability,
      email,
      gender,
      isBaptized,
      isHouseOwner,
      maritalStatus,
      phone,

      work,
    } = req.body;
    let church = await findChurchByUUID(church_uuid);
    let user;
    //check if phone is not null
    if (phone) {
      //check if user is already registered
      user = await User.findOne({
        email,
      });
      if (!user) {
        user = await User.create({
          name,
          email,
          phone,
          role: "member",
          password: bcrypt.hashSync("123456", 10),
        });
      }
    }

    //add member
    const response = await Member.create({
      name,
      address,
      birthDate,
      churchId: church.id,
      disability,
      email,
      gender,
      isBaptized,
      isHouseOwner,
      maritalStatus,
      phone,
      work,
      userId: user ? user.id : null,
    });

    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getChurchMembers = async (req, res) => {
  try {
    const { uuid } = req.params;
    console.log(uuid);
    const church = await findChurchByUUID(uuid);
    const { group, keyword } = req.query;
    let members;
    // console.log(group);
    // console.log(keyword);
    if (group) {
      let filter = {};
      // console.log(group);
      console.log("Filter", filter);
      switch (group) {
        case "Men":
          filter.gender = "Male";
          break;
        case "Women":
          filter.gender = "Female";
          break;
        case "Married":
          filter.maritalStatus = "Married";
          break;
        case "Not Married":
          filter.maritalStatus = "Not Married";
          break;
        case "Children":
          const date = new Date();
          filter.birthDate = {
            [Op.gte]: date.setFullYear(date.getFullYear() - 16),
          };
          break;
        default:
          break;
      }
      console.log("Filter", filter);
      members = await Member.findAll({
        where: {
          [Op.and]: [
            {
              churchId: church.id,
            },
            {
              ...filter,
            },
          ],
        },
      });
    } else if (keyword) {
      console.log("keyword filter");
      members = await Member.findAll({
        where: {
          [Op.and]: [
            {
              churchId: church.id,
            },
            {
              name: {
                [Op.like]: `%${keyword}%`,
              },
            },
          ],
        },
        limit: 5,
      });
      console.log(members);
    } else {
      members = await Member.findAll({
        where: {
          churchId: church.id,
        },
      });
    }

    successResponse(res, members);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getMember = async (req, res) => {
  try {
    const { uuid } = req.params;
    const member = await findMemberByUUID(uuid);
    successResponse(res, member);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteMember = async (req, res) => {
  try {
    const { uuid } = req.params;
    const member = await findMemberByUUID(uuid);
    const response = await member.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateMember = async (req, res) => {
  try {
    const { uuid } = req.params;
    const member = await findMemberByUUID(uuid);
    const response = await member.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addMember,
  findMemberByUUID,
  getChurchMembers,
  getMember,
  deleteMember,
  updateMember,
};
