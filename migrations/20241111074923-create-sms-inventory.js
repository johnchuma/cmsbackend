"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("SMSInventories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("SMSInventories");
  },
};
