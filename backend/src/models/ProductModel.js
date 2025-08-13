const db = require("../config/db");
const { DataTypes } = require("sequelize");

const OriginModel = require("./OriginModel");
const OperatingSystemModel = require("./OperatingSystemModel");
const WareHouseModel = require("./WareHouseModel");
const BrandModel = require("./BrandModel");

// Định nghĩa ProductModel
const ProductModel = db.define(
  "ProductModel",
  {
    ma_sp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ten_sp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hinh_anh: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    chip_xu_ly: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dung_luong_pin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    kich_thuoc_man: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    camera_truoc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    camera_sau: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hdh: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OperatingSystemModel,
        key: "ma_hdh",
      },
    },
    thuong_hieu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: BrandModel,
        key: "ma_thuong_hieu",
      },
    },
    xuat_xu: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OriginModel,
        key: "ma_xuat_xu",
      },
    },
    khu_vuc_kho: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: WareHouseModel,
        key: "ma_kho",
      },
    },
    so_luong_ton: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mo_ta_sp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "san_pham",
    timestamps: false,
  }
);

module.exports = ProductModel;
