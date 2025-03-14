"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PosterRequestAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PosterRequestAttachment.belongsTo(models.PosterRequest);
    }
  }
  PosterRequestAttachment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      posterRequestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PosterRequestAttachment",
    }
  );
  return PosterRequestAttachment;
};
