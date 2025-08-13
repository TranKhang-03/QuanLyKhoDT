// models/OriginModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Origin = sequelize.define(
  "Origin",
  {
    ma_xuat_xu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ten_xuat_xu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "xuat_xu",
    timestamps: false,
  }
);

module.exports = Origin;
