"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupLeader extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupLeader.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      from: {
        type: DataTypes.DATE,
        defaultValue: false,
      },
      to: {
        type: DataTypes.DATE,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "GroupLeader",
    }
  );
  return GroupLeader;
};
