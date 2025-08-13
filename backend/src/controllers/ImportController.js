const { Sequelize } = require('sequelize');
const Import = require('../models/ImportModel')
const ctpn = require('../models/detailImportModel')
const Product = require("../models/ProductModel");
const phienbanSP = require('../models/PhienBanSPModel')

exports.getImports = async (req, res) => {
    try{
        const imports = await Import.findAll();
        res.json(imports);
    }
    catch(err){
        res.status(500).json({message: ' Tải danh sách phiếu nhập lỗi ', error: err.message});
    }
};

exports.getImportByID = async (req, res) => {
    const {ma_pn} = req.params
    try{
        const ImportID = await Import.findByPk(ma_pn);
        if(!ImportID)
        {
            res.status(404).json({message: 'Không tìm thấy phiếu nhập'})
        }
        res.json(ImportID)
    }
    catch(err){
        res.status(500).json({message: ' Tải phiếu nhập lỗi ', error: err.message});
    }
}

exports.addImport = async (req, res) => {
    const trang_thai = 1;
    const { ma_nv, ma_ncc, thoi_gian_nhap, tong_tien, chi_tiet_phieu_nhap} = req.body;
    try{
        const newImport = await Import.create({
            ma_nv: ma_nv,
            ma_ncc: ma_ncc,
            thoi_gian_nhap: thoi_gian_nhap,
            tong_tien: tong_tien,
            trang_thai: trang_thai
        })
        for (const item of chi_tiet_phieu_nhap) {
            const newDetail = await ctpn.create({
                ma_pn: newImport.dataValues.ma_pn,
                ma_phien_ban_sp: item.ma_phien_ban_sp,
                so_luong: item.so_luong,
                gia_nhap: item.gia_nhap
            })
            const pbsp = await phienbanSP.findByPk(item.ma_phien_ban_sp);
            const newSLPB = pbsp.ton_kho + item.so_luong;
            pbsp.ton_kho = newSLPB;
            await pbsp.save();

            const Prd = await Product.findByPk(item.ma_sp);
            const newSLPrd = Prd.so_luong_ton + item.so_luong;
            Prd.so_luong_ton = newSLPrd;
            await Prd.save();
        }
        if(!newImport)
            res.status(404).json({message: 'thêm không thành công'})
        res.json({message: 'Thêm phiếu nhập thành công'})
    }
    catch(err){
        res.status(500).json({message: ' Lỗi khi thêm phiếu nhập ', error: err.message});
    }
}
