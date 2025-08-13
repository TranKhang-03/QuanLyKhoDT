const {DataTypes} = require('sequelize')
const db= require('../config/db')

const WareHouse=db.define('Warehouse',{
    ma_kho : {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    ten_kho : {
        type:DataTypes.STRING,
        allowNull:false
    },
    chu_thich : {
        type:DataTypes.STRING
    },
    trang_thai : {
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    tableName:'khu_vuc_kho',
    timestamps:false
});
module.exports = WareHouse;