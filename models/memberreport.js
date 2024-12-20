"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MemberReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MemberReport.belongsTo(models.Member);
      // define association here
    }
  }
  MemberReport.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "MemberReport",
      scopes: {
        excludeAttributes: {
          attributes: {
            exclude: [
              "isActive",
              "description",
              "type",
              "memberId",
              "uuid",
              "id",
              "createdAt",
              "updatedAt",
              "MemberId",
            ],
          },
        },
      },
    }
  );
  return MemberReport;
};
