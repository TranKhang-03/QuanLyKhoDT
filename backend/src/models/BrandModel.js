// models/BrandModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Brand = sequelize.define(
  "Brand",
  {
    ma_thuong_hieu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ten_thuong_hieu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "thuong_hieu",
    timestamps: false,
  }
);

module.exports = Brand;
