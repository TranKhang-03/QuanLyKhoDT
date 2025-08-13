const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const permissionModel = require("../models/permissionModel");

const Employee = sequelize.define(
  "Employee",
  {
    ma_nv: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    ten_nv: {
      type: DataTypes.STRING,
    },
    gioi_tinh: {
      type: DataTypes.STRING,
    },
    sdt: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mat_khau: {
      type: DataTypes.STRING,
    },
    ma_quyen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: permissionModel,
        key: 'ma_quyen',
      }
    },
    trang_thai: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "nhan_vien",
    timestamps: false,
  }
);
module.exports= Employee ;