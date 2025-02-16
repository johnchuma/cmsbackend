"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PosterRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PosterRequest.belongsTo(models.Church, {
        onDelete: "CASCADE",
        scope: true,
      });
      PosterRequest.hasMany(models.PosterRequestAttachment, {
        onDelete: "CASCADE",
        scope: true,
      });
    }
  }
  PosterRequest.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      description: {
        type: DataTypes.TEXT("long"),
        
        allowNull: false,
      },
      churchId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PosterRequest",
    }
  );
  return PosterRequest;
};
