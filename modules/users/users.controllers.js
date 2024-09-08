const { Op } = require("sequelize");
const { User } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { errorResponse, successResponse } = require("../../utils/responses");

const findUserByUUID = async (uuid) => {
  try {
    const user = await User.findOne({
      where: {
        uuid,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const addUser = async (req, res) => {
  try {
    let { role, phone, name, email, password } = req.body;
    let user;
    user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      res.status(401).json({
        status: false,
        message: "User already exist",
      });
    } else {
      password = bcrypt.hashSync(password, 10);
      const response = await User.create({
        name,
        phone,
        password,
        email,
        role,
      });
      const tokens = generateJwtTokens(response);
      successResponse(res, { tokens: tokens });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      console.log(result);
      if (result) {
        const token = generateJwtTokens(user);
        res.status(200).json({
          token,
          status: true,
        });
      } else {
        res.status(401).send({
          status: false,
          message: "Wrong password",
        });
      }
    } else {
      res.status(404).send({ status: false, message: "User does not exist" });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: {
        exclude: ["id"],
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getUserInfo = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = req.user;
    const response = await findUserByUUID(user.uuid);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addUser,
  findUserByUUID,
  getUsers,
  login,
  deleteUser,
  getUserInfo,
  getMyInfo,
  updateUser,
};
