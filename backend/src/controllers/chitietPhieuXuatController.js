//const detailExport = require("../models/chiTietPhieuXuatModel");
const models = require("../models/Relationship")

exports.getDetailExport = async(req, res) =>{
    const {ma_px} = req.params
    try{
        const detailExportByID = await models.chiTietPhieuXuatModel.findAll({
            where: { 
                ma_px: ma_px
             }
          });
        if(detailExportByID.length === 0)
            {
                res.status(404).json({message: 'Không tìm thấy chi tiết phiếu xuất'})
            }
            res.json(detailExportByID)
        }
    catch(err){
        res.status(500).json({message: ' Tải chi tiết phiếu xuất lỗi ', error: err.message});
    }
} 