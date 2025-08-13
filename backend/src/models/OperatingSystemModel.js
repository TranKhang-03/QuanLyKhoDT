// models/OperatingSystemModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OperatingSystem = sequelize.define(
  "OperatingSystem",
  {
    ma_hdh: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ten_hdh: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "he_dieu_hanh",
    timestamps: false,
  }
);

module.exports = OperatingSystem;
