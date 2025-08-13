const db = require("../config/db");
const { DataTypes } = require("sequelize");

const Permission = db.define(
  "Permission",
  {
    ma_quyen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    ten_quyen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trang_thai:{
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "nhom_quyen",
    timestamps: false,
  }
);

module.exports = Permission;


