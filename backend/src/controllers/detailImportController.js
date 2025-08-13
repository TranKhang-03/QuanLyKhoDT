const { Sequelize } = require('sequelize');
const ctpn = require('../models/detailImportModel')


exports.getDetailImport = async(req, res) =>{
    const {ma_pn} = req.params
    try{
        const detailImportByID = await ctpn.findAll({
            where: { 
                ma_pn: ma_pn
             }
          });
        if(detailImportByID.length === 0)
            {
                res.status(404).json({message: 'Không tìm thấy chi tiết phiếu nhập'})
            }
            res.json(detailImportByID)
        }
    catch(err){
        res.status(500).json({message: ' Tải chi tiết phiếu nhập lỗi ', error: err.message});
    }
} 

exports.adddetailImport = async (req, res) => {
    const { ma_pn, ma_phien_ban_sp, so_luong, gia_nhap} = req.body;
    try{
        const newDetail = await ctpn.create({
            ma_pn: ma_pn,
            ma_phien_ban_sp: ma_phien_ban_sp,
            so_luong: so_luong,
            gia_nhap: gia_nhap
        })
        if(!newDetail){
            res.status(404).json({message: 'thêm không thành công'})
        }
        res.json({message: 'Thêm chi tiết phiếu nhập thành công'})
    }
    catch(err){
        res.status(500).json({message: ' Lỗi khi thêm chi tiết phiếu nhập ', error: err.message});
    }
}