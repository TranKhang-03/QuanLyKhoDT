const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CustomerModel = sequelize.define('Customer', {
    ma_kh: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ten_kh: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dia_chi_kh: {
        type: DataTypes.STRING,
    },
    sdt_kh: {
        type: DataTypes.STRING,
    },
    trang_thai: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    }
}, { tableName: 'khach_hang', timestamps: false });
module.exports = CustomerModel;
