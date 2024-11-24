const {
  Member,
  User,
  sequelize,
  MemberReport,
  Guest,
  Group,
  Tithing,
  Project,
  OfferingRecord,
  Offering,
  GroupExpense,
  Record,
  Contribution,
  Pledge,
  Service,
} = require("../../models");
const { monthsNames } = require("../../utils/constants");
const {
  removeNullResponse,
  handleNullResponse,
} = require("../../utils/removeNullResponse");
const { successResponse, errorResponse } = require("../../utils/responses");
const { findChurchByUUID } = require("../churches/churches.controllers");
const moment = require("moment");

const getMemberStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    const church = await findChurchByUUID(uuid);
    const { year } = req.query;
    const date = new Date();
    const childrenBithdateLimit = moment(
      date.setFullYear(date.getFullYear() - 16)
    ).format("yyy-MM-DD");
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    //get overview stats
    const stats = await Member.scope("excludeAttributes").findOne({
      where: {
        churchId: church.id,
      },
      attributes: {
        include: [
          [
            sequelize.literal(`SUM(CASE WHEN id >= 0 THEN 1 ELSE 0 END)`),
            "members",
          ],
          [
            sequelize.literal(
              `SUM(CASE WHEN gender = 'Male' THEN 1 ELSE 0 END)`
            ),
            "men",
          ],
          [
            sequelize.literal(
              `SUM(CASE WHEN gender = 'Female' THEN 1 ELSE 0 END)`
            ),
            "women",
          ],
          [
            sequelize.literal(
              `SUM(CASE WHEN birthDate >= '${childrenBithdateLimit}' THEN 1 ELSE 0 END)`
            ),
            "children",
          ],
        ],
      },
    });

    //members increase over monthly filtered by year
    const membersIncrease = await Member.scope("excludeAttributes").findOne({
      where: {
        churchId: church.id,
      },
      attributes: {
        include: months.map((item, index) => [
          sequelize.literal(
            `SUM(CASE WHEN MONTH(createdAt) = ${item} AND YEAR(createdAt) = ${year} THEN 1 ELSE 0 END)`
          ),
          monthsNames[index],
        ]),
      },
    });

    //sicks increase over monthly
    const sicknessReports = await MemberReport.scope(
      "excludeAttributes"
    ).findOne({
      where: {
        type: "Sick",
      },
      include: {
        model: Member,
        where: {
          churchId: church.id,
        },
        attributes: [], // Specify attributes if needed
      },
      attributes: {
        include: months.map((item, index) => [
          sequelize.literal(
            `SUM(CASE WHEN MONTH(MemberReport.createdAt) = ${item} AND YEAR(MemberReport.createdAt) = ${year} THEN 1 ELSE 0 END)`
          ),
          monthsNames[index],
        ]),
      },
      group: ["MemberReport.id"], // Group by the primary key or a suitable field
    });
    const traveledReports = await MemberReport.scope(
      "excludeAttributes"
    ).findOne({
      where: {
        type: "Traveling",
      },
      include: {
        model: Member,
        where: {
          churchId: church.id,
        },
        attributes: [], // Specify attributes if needed
      },
      attributes: {
        include: months.map((item, index) => [
          sequelize.literal(
            `SUM(CASE WHEN MONTH(MemberReport.createdAt) = ${item} AND YEAR(MemberReport.createdAt) = ${year} THEN 1 ELSE 0 END)`
          ),
          monthsNames[index],
        ]),
      },
      group: ["MemberReport.id"], // Group by the primary key or a suitable field
    });
    const guestsReports = await Guest.scope("excludeAttributes").findOne({
      include: [
        {
          model: Service,
          attributes: [],
          include: [
            {
              model: Group,
              where: {
                churchId: church.id,
              },
              attributes: [],
            },
          ],
        },
      ],

      attributes: {
        include: months.map((item, index) => [
          sequelize.literal(
            `SUM(CASE WHEN MONTH(Guest.createdAt) = ${item} AND YEAR(Guest.createdAt) = ${year} THEN 1 ELSE 0 END)`
          ),
          monthsNames[index],
        ]),
      },
      group: ["Guest.id"],
    });
    console.log(
      stats,
      membersIncrease,
      sicknessReports,
      traveledReports,
      guestsReports
    );
    successResponse(res, {
      stats: removeNullResponse(stats),
      membersIncrease: removeNullResponse(membersIncrease),
      sicknessReports: handleNullResponse(sicknessReports),
      traveledReports: handleNullResponse(traveledReports),
      guestsReports: guestsReports,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getFinanceStats = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { year } = req.query;
    const church = await findChurchByUUID(uuid);

    const { Op, fn, col } = require("sequelize");

    // Get sum of tithings grouped by week
    const weeklyTithings = await Tithing.findAll({
      include: [
        {
          model: Member,
          where: {
            churchId: church.id,
          },
          attributes: [],
        },
      ],
      attributes: [
        [fn("WEEK", col("Tithing.createdAt")), "week"], // Extract week number
        [fn("SUM", col("amount")), "totalAmount"], // Sum the amount for that week
      ],
      where: sequelize.where(fn("YEAR", col("Tithing.createdAt")), year),
      group: [fn("WEEK", col("Tithing.createdAt"))], // Group by week number
      raw: true, // Return raw results for easier manipulation
      order: [[fn("WEEK", col("Tithing.createdAt")), "ASC"]], // Order by week number
    });
    // Transform the result into the format {week 1: total, week 2: total, ...}
    const tithingsByWeek = {};
    weeklyTithings.forEach((weekData) => {
      tithingsByWeek[`week ${weekData.week}`] = weekData.totalAmount;
    });

    const monthlyExpenses = await GroupExpense.findAll({
      include: [
        {
          model: Group,
          where: {
            churchId: church.id,
          },
          attributes: [],
        },
      ],
      attributes: [
        [fn("MONTH", col("GroupExpense.createdAt")), "month"], // Extract month number
        [fn("SUM", col("amount")), "totalAmount"], // Sum the amount for that month
      ],
      where: sequelize.where(fn("YEAR", col("GroupExpense.createdAt")), year),
      group: [fn("MONTH", col("GroupExpense.createdAt"))], // Group by month number
      raw: true, // Return raw results for easier manipulation
      order: [[fn("MONTH", col("GroupExpense.createdAt")), "ASC"]], // Order by month number
    });

    // Transform the result into the format {month 1: total, month 2: total, ...}
    const expensesByMonth = {};
    monthlyExpenses.forEach((monthData) => {
      expensesByMonth[monthsNames[monthData.month - 1]] = monthData.totalAmount;
    });

    const totalOfferings = await OfferingRecord.sum("amount", {
      include: [
        {
          model: Offering,
          include: [
            {
              model: Service,
              include: [
                {
                  model: Group,
                  where: {
                    churchId: church.id,
                  },
                  attributes: [],
                },
              ],
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      where: sequelize.where(
        sequelize.fn("YEAR", sequelize.col("OfferingRecord.createdAt")),
        year
      ),
    });
    const totalTithings = await Tithing.sum("amount", {
      include: [
        {
          model: Member,
          where: {
            churchId: church.id,
          },
          attributes: [],
        },
      ],
      where: sequelize.where(
        sequelize.fn("YEAR", sequelize.col("Tithing.createdAt")),
        year
      ),
    });
    const totalPledges = await Pledge.sum("amount", {
      include: [
        {
          model: Member,
          where: {
            churchId: church.id,
          },
          attributes: [],
        },
      ],
      where: sequelize.where(
        sequelize.fn("YEAR", sequelize.col("Pledge.createdAt")),
        year
      ),
    });
    const totalContributions = await Contribution.sum("Contribution.amount", {
      include: [
        {
          model: Pledge,
          include: [
            {
              model: Member,
              where: {
                churchId: church.id,
              },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      where: sequelize.where(
        sequelize.fn("YEAR", sequelize.col("Contribution.createdAt")),
        year
      ),
    });

    const contributionsByProjects = await Contribution.findAll({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("Contribution.amount")),
          "totalContribution",
        ],
        [sequelize.col("Pledge.Project.name"), "project"],
      ],
      include: [
        {
          model: Pledge,
          include: [
            {
              model: Member,
              where: {
                churchId: church.id,
              },
              attributes: [],
            },
            {
              model: Project, // Include the Project model to access the project name
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      where: sequelize.where(
        sequelize.fn("YEAR", sequelize.col("Contribution.createdAt")),
        year
      ),
      group: ["Pledge.Project.name"], // Group by the project name to calculate total contributions per project
    });

    const unpaidPledges = totalPledges - totalContributions;
    const stats = {
      totalTithings: totalTithings ?? 0,
      totalPledges: totalPledges ?? 0,
      totalContributions: totalContributions ?? 0,
      unpaidPledges: unpaidPledges ?? 0,
      totalOfferings: totalOfferings ?? 0,
    };
    successResponse(res, {
      stats: stats,
      tithingsByWeek,
      expensesByMonth,
      contributionsByProjects,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = { getMemberStats, getFinanceStats };
