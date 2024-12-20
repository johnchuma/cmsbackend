"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsTo(models.Church);
      Member.hasMany(models.MemberReport);
      Member.hasMany(models.GroupMember);
      Member.hasMany(models.Tithing);
    }
  }
  Member.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      churchId: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      disability: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("Male", "Female"),
        allowNull: false,
      },
      isBaptized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isHouseOwner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      maritalStatus: {
        type: DataTypes.ENUM("Married", "Not married"),
        defaultValue: "Not married",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      work: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Member",
      scopes: {
        excludeAttributes: {
          attributes: {
            exclude: [
              "id",
              "churchId",
              "disability",
              "gender",
              "address",
              "phone",
              "email",
              "birthDate",
              "uuid",
              "userId",
              "UserId",
              "ChurchId",
              "createdAt",
              "updatedAt",
              "name",
              "isBaptized",
              "maritalStatus",
              "work",
              "isHouseOwner",
              "isActive",
            ],
          },
        },
      },
    }
  );
  return Member;
};
