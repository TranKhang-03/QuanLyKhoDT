const db = require("../config/db");
const { DataTypes } = require("sequelize");
const FeaturePermission = db.define(
    "FeaturePermission",
    {
      ma_chuc_nang: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ten_chuc_nang: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trang_thai:{
        type: DataTypes.INTEGER,
      },
    },
    {
      tableName: "chuc_nang",
      timestamps: false,
    }
  );
  module.exports= FeaturePermission;