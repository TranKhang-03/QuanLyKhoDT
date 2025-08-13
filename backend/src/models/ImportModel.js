const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee =require('../models/EmployeeModel');
const Provider =require('../models/providerModel');


const Import = sequelize.define('Import',{
    ma_pn: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ma_nv: {
        type: DataTypes.INTEGER,
        references:{
            model : Employee,
            key: 'ma_nv',
        }
    },
    ma_ncc: {
        type: DataTypes.INTEGER,
        references:{
            model : Provider,
            key : 'ma_ncc',
        }
    },
    thoi_gian_nhap: {
        type: DataTypes.DATE,
    },
    tong_tien: {
        type: DataTypes.INTEGER,
    },
    trang_thai:{
        type: DataTypes.INTEGER,
    }

}, {
    tableName: 'phieu_nhap',
    timestamps: false,
} )

module.exports = Import;