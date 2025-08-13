const { Sequelize, Model } = require("sequelize");
const { PhienBanSPModel } = require("../models/Relationship");
const Ram = require("../models/RamModel");
const Rom = require("../models/RomModel");
const Color = require("../models/ColorModel");
const { Op } = require("sequelize");

exports.getAllPBSP = async (req, res) => {
  try {
    const phienbanSP = await PhienBanSPModel.findAll({
      where: {
        trang_thai: 1,
      },
      include: [
        {
          model: Ram,
          as: "ram",
          attributes: ["ma_ram", "kich_thuoc_ram"],
        },
        {
          model: Rom,
          as: "rom",
          attributes: ["ma_rom", "kich_thuoc_rom"],
        },
        {
          model: Color,
          as: "mauSac",
          attributes: ["ma_mau", "ten_mau"],
        },
      ],
    });
    res.json(phienbanSP);
  } catch (err) {
    res.status(500).json({
      message: " Tải danh sách phiên bản sản phẩm lỗi ",
      error: err.message,
    });
  }
};
exports.updatedSL = async (req, res) => {
  const { ma_phien_ban_sp } = req.params;
  const { so_luong_moi } = req.body;
  try {
    const pbsp = await PhienBanSPModel.findByPk(ma_phien_ban_sp);
    if (!pbsp)
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    const newSL = pbsp.ton_kho + so_luong_moi;
    pbsp.ton_kho = newSL;
    await pbsp.save();
    res.status(200).json({ message: "Cập nhật số lượng tồn kho thành công" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi cập nhật số lượng tồn kho!" });
  }
};

// Hàm thêm cấu hình sản phẩm

exports.addConfigurations = async (req, res) => {
  try {
    const { ma_sp, configurationsData } = req.body;
    // Danh sách cấu hình thêm thành công và bị trùng lặp
    const addedConfigurations = [];
    const duplicateConfigurations = [];

    // Duyệt từng cấu hình
    for (const config of configurationsData) {
      const { ma_ram, ma_rom, ma_mau, gia_nhap, gia_xuat, ton_kho } = config;

      // Kiểm tra xem cấu hình đã tồn tại chưa
      const existingConfig = await PhienBanSPModel.findOne({
        where: {
          ma_sp,
          ma_ram,
          ma_rom,
          ma_mau,
          trang_thai: 1,
        },
      });

      if (existingConfig) {
        duplicateConfigurations.push({
          config,
          reason: "Cấu hình đã tồn tại.",
        });
        continue;
      }

      // Thêm mới cấu hình
      const newConfig = await PhienBanSPModel.create({
        ma_sp,
        ma_ram,
        ma_rom,
        ma_mau,
        gia_nhap,
        gia_xuat,
        ton_kho: ton_kho || 0, // Nếu không có tồn kho, mặc định là 0
        trang_thai: 1, // Mặc định trạng thái là hoạt động
      });

      addedConfigurations.push(newConfig);
    }

    // Phản hồi kết quả
    res.status(201).json({
      success: true,
      message: "Thêm cấu hình sản phẩm hoàn tất.",
      data: {
        addedConfigurations,
        duplicateConfigurations,
      },
    });
  } catch (error) {
    console.error("Lỗi khi thêm cấu hình sản phẩm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server. Vui lòng thử lại sau.",
    });
  }
};
