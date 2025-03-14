"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Guest.belongsTo(models.Service);
      // define association here
    }
  }
  Guest.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Guest",
      scopes: {
        excludeAttributes: {
          attributes: {
            exclude: [
              "id",
              "serviceId",
              "ServiceId",
              "description",
              "name",
              "uuid",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      },
    }
  );
  return Guest;
};
