// models/RamModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ram = sequelize.define(
  "Ram",
  {
    ma_ram: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kich_thuoc_ram: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "ram",
    timestamps: false,
  }
);

module.exports = Ram;
