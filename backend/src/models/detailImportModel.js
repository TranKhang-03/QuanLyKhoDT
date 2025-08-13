const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const importModel = require('./ImportModel')
const PhienBanSPModel = require('./PhienBanSPModel')

const detailImport = sequelize.define('detailImport', {
    ma_pn: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references:{
            model : importModel ,
            key: 'ma_pn',
        }
    },
    ma_phien_ban_sp: {
        type: DataTypes.INTEGER,
        primaryKey:true,
        references:{
            model : PhienBanSPModel ,
            key: 'ma_phien_ban_sp',
        }
    },
    so_luong: {
        type: DataTypes.INTEGER,
    },
    // ma_kho: {
    //     type: DataTypes.INTEGER,
    //     references:{
    //         model: WareHouse,
    //         key: 'ma_kho',
    //     }
    // },
    gia_nhap: {
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'chi_tiet_phieu_nhap',
    timestamps: false,
})
module.exports = detailImport;