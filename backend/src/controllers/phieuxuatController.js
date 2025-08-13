const { Sequelize } = require('sequelize');
const Export = require("../models/phieuXuatModel");
const ctpx = require("../models/chitietPhieuXuatModel")
const Product = require("../models/ProductModel");
const phienbanSP = require('../models/PhienBanSPModel')

// lấy tất cả phiếu xuất
exports.getExports = async (req, res) => {
    try{
        const exports = await Export.findAll();
        res.json(exports);
    }
    catch(err){
        res.status(500).json({message: ' Tải danh sách phiếu xuất lỗi ', error: err.message});
    }
};

// lấy phiếu xuất theo Id
exports.getExportByID = async (req, res) => {
    const {ma_px} = req.params
    try{
        const ExportID = await Export.findByPk(ma_px);
        if(!ExportID)
        {
            res.status(404).json({message: 'Không tìm thấy phiếu xuất'})
        }
        res.json(ExportID)
    }
    catch(err){
        res.status(500).json({message: ' Tải phiếu xuất lỗi ', error: err.message});
    }
}


// Thêm hóa đơn
exports.addExport = async (req, res) => {
    const trang_thai = 1
    const { ma_nv, ma_kh, thoi_gian_xuat, tong_tien, chi_tiet_phieu_xuat} = req.body
    try{
        const newExport = await Export.create({
            ma_nv: ma_nv,
            ma_kh :ma_kh,
            thoi_gian_xuat: thoi_gian_xuat,
            tong_tien: tong_tien,
            trang_thai: trang_thai
        })
        for (const item of chi_tiet_phieu_xuat) {
            const newDetail = await ctpx.create({
                ma_px: newExport.dataValues.ma_px,
                ma_phien_ban_sp: item.ma_phien_ban_sp,
                so_luong: item.so_luong,
                gia_xuat: item.gia_xuat
            })
            const pbsp = await phienbanSP.findByPk(item.ma_phien_ban_sp);
            const newSLPB = pbsp.ton_kho - item.so_luong;
            pbsp.ton_kho = newSLPB;
            await pbsp.save();

            const Prd = await Product.findByPk(item.ma_sp);
            const newSLPrd = Prd.so_luong_ton - item.so_luong;
            Prd.so_luong_ton = newSLPrd;
            await Prd.save();
        if(!newExport)
            res.status(404).json({message: 'thêm không thành công'})
        res.json({message: 'Thêm phiếu xuất thành công'})
    }
}
    catch(err){
        res.status(500).json({message: ' Lỗi khi thêm phiếu xuất ', error: err.message});
    }
}