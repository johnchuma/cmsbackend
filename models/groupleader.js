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
      GroupLeader.belongsTo(models.Member);
      GroupLeader.belongsTo(models.Group);
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
      position:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      from: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      to: {
        type: DataTypes.DATE,
        allowNull: false,
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
