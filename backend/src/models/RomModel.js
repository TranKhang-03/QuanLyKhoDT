// models/RomModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rom = sequelize.define(
  "Rom",
  {
    ma_rom: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kich_thuoc_rom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "rom",
    timestamps: false,
  }
);

module.exports = Rom;
