const { Op,Sequelize } = require("sequelize");
const { Tithing, Product, Member,Church} = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { findUserByUUID } = require("../users/users.controllers");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findMemberByUUID } = require("../members/members.controllers");
const { findChurchByUUID } = require("../churches/churches.controllers");
const { sendMessage } = require("../messages/messages.controllers");
const moment = require("moment")
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
    const { amount, member_uuid,createdAt } = req.body;
    const member = await findMemberByUUID(member_uuid);
    console.log("member response", member.churchId)
    const resChurch = await Church.findOne({
      where:{id:member.churchId}
    })
    const church = await findChurchByUUID(resChurch.uuid)
    let availableSMS = church.availableSMS;
    console.log("SMS", availableSMS)
    const response = await Tithing.create({
      amount,
      memberId: member.id,
      createdAt:createdAt||new Date()
    });
    if(availableSMS>0){
      sendMessage({member:member,church:church,sms:`Mpendwa ${member.name},\n${church.name} tumepokea kikamilifu Fungu lako la kumi la TZS ${amount.toLocaleString()} tarehe ${moment(response.createdAt).format("DD/MM/yyy")}, \nUbarikiwe.`})
    }
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getChurchTithings = async (req, res) => {
  try {
    const { uuid } = req.params;
    const {from,to} = req.query;
    let filter = {
      
    }
    if(from && to){
      filter.createdAt = {
        [Op.between]:[from,to]
      }
    }
    const church = await findChurchByUUID(uuid);
    const response = await Tithing.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        exclude: ["id"],
      },
      where:filter,
      include: [
        {
          model: Member,
          where:{
           churchId: church.id,
          },
          required:true
        },
      ],
    });
    const totalTithings = await Tithing.sum("amount",{
      where:filter,
      include:[
        {
          model: Member,
          where:{
           churchId: church.id,
          },
          attributes:[],
          required:true
        },
      ]
    })
    successResponse(res, {
      page: req.page,
      totalTithings,
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
const getYearlyMemberTithingsReport = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { year } = req.query;

    if (!year) {
      return errorResponse(res, "Year is required.");
    }

    const member = await findMemberByUUID(uuid);
    if (!member) {
      return errorResponse(res, "Member not found.");
    }

    // Default report structure with all months set to 0
    let report = {
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
    };

    // Query to get the total tithings per month
    const tithings = await Tithing.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        memberId: member.id,
        createdAt: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      raw: true,
    });

    // Map results into the report object
    tithings.forEach(({ month, totalAmount }) => {
      const monthMap = {
        1: "jan",
        2: "feb",
        3: "mar",
        4: "apr",
        5: "may",
        6: "jun",
        7: "jul",
        8: "aug",
        9: "sep",
        10: "oct",
        11: "nov",
        12: "dec",
      };
      report[monthMap[month]] = totalAmount;
    });

    successResponse(res, report);
  } catch (error) {
    console.error(error);
    errorResponse(res, error);
  }
};
const getYearlyMembersTithingsReport = async (req, res) => {
  try {
    const {uuid} = req.params;
    const { year } = req.query;
   const church = await findChurchByUUID(uuid);
    if (!year) {
      return errorResponse(res, "Year is required.");
    }

    // Fetch all members
    const members = await Member.findAll(
      { 
        attributes: ["id", "name"],
        where:{
          churchId:church.id
        } 
    });

    if (!members.length) {
      return successResponse(res, []);
    }

    // Fetch tithing data grouped by member and month
    const tithings = await Tithing.findAll({
      attributes: [
        "memberId",
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      where: {
        createdAt: {
          [Op.between]: [`${year}-01-01`, `${year}-12-31`],
        },
      },
      group: ["memberId", Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      raw: true,
    });

    // Structure the response
    const monthMap = {
      1: "jan",
      2: "feb",
      3: "mar",
      4: "apr",
      5: "may",
      6: "jun",
      7: "jul",
      8: "aug",
      9: "sep",
      10: "oct",
      11: "nov",
      12: "dec",
    };

    const memberReports = members.map((member) => {
      let report = {
        jan: 0,
        feb: 0,
        mar: 0,
        apr: 0,
        may: 0,
        jun: 0,
        jul: 0,
        aug: 0,
        sep: 0,
        oct: 0,
        nov: 0,
        dec: 0,
      };

      let total = 0;

      // Find this member's tithing data
      tithings
        .filter((t) => t.memberId === member.id)
        .forEach(({ month, totalAmount }) => {
          report[monthMap[month]] = totalAmount;
          total += totalAmount;
        });

      return {
        memberId: member.id,
        name: member.name,
        report,
        total,
      };
    });

    successResponse(res, memberReports);
  } catch (error) {
    console.error(error);
    errorResponse(res, error);
  }
};

const getSingleMemberTithings = async (req, res) => {
  try {
    const member = req.user;
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
  getSingleMemberTithings,
  getMemberTithings,
  getYearlyMemberTithingsReport,
  getYearlyMembersTithingsReport,
  getTithing,
  deleteTithing,
  updateTithing,
};
