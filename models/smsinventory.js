"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SMSInventory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SMSInventory.belongsTo(models.Church)
    }
  }
  SMSInventory.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      count: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      churchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SMSInventory",
    }
  );
  return SMSInventory;
};
