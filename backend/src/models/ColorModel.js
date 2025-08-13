// models/ColorModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Color = sequelize.define(
  "Color",
  {
    ma_mau: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ten_mau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "mau_sac",
    timestamps: false,
  }
);

module.exports = Color;
