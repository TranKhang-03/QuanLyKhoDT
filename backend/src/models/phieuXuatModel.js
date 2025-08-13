const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const CustomerModel = require('../models/CustomerModel');
// const Employee =require('../models/EmployeeModel');
const KhachHang = require('./CustomerModel')
const NhanVien = require('./EmployeeModel')
//const models = require('../models/Relationship')


const PhieuXuatModel = sequelize.define('PhieuXuatModel', {
    ma_px: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    ma_kh: {
        type: DataTypes.INTEGER,
        references: {
            model: KhachHang,
            key: 'ma_kh',
        },
    },
    ma_nv: {
        type: DataTypes.INTEGER,
        references:{
            model : NhanVien,
            key: 'ma_nv',
        }
    },
    thoi_gian_xuat: {
        type: DataTypes.DATE,
    },
    tong_tien: {
        type: DataTypes.INTEGER,
    },
    trang_thai:{
        type: DataTypes.INTEGER,
    }
}, { tableName: 'phieu_xuat', timestamps: false });
module.exports = PhieuXuatModel;
