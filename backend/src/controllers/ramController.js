const Ram = require("../models/RamModel");
const { Op } = require("sequelize");

// Lấy tất cả RAM
exports.getAllRams = async (req, res) => {
  try {
    const rams = await Ram.findAll({
      attributes: ["ma_ram", "kich_thuoc_ram"], // Lấy các thuộc tính của RAM
      where: {
        trang_thai: 1,
      },
    });
    res.json(rams);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu RAM:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu RAM" });
  }
};

// Thêm RAM mới
exports.addRam = async (req, res) => {
  const { kich_thuoc_ram } = req.body;

  if (!kich_thuoc_ram || kich_thuoc_ram.trim() === "") {
    return res
      .status(400)
      .json({ error: "Kích thước RAM không được để trống" });
  }

  try {
    // Kiểm tra xem kích thước RAM đã tồn tại chưa
    const ramExists = await Ram.findOne({
      where: { kich_thuoc_ram, trang_thai: 1 },
    });
    if (ramExists) {
      return res.status(409).json({ error: "Kích thước RAM đã tồn tại" });
    }

    const newRam = await Ram.create({ kich_thuoc_ram });
    res.status(201).json(newRam); // Trả về RAM vừa thêm vào
  } catch (error) {
    console.error("Lỗi khi thêm RAM:", error.message);
    res.status(500).json({ error: "Lỗi khi thêm RAM" });
  }
};

// Cập nhật RAM
exports.updateRam = async (req, res) => {
  const { id } = req.params;
  const { kich_thuoc_ram } = req.body;

  if (!kich_thuoc_ram || kich_thuoc_ram.trim() === "") {
    return res
      .status(400)
      .json({ error: "Kích thước RAM không được để trống" });
  }

  try {
    // Kiểm tra xem kích thước RAM mới đã tồn tại trong hệ thống chưa
    const ramExists = await Ram.findOne({
      where: {
        kich_thuoc_ram,
        ma_ram: { [Op.ne]: id }, // Kiểm tra tên RAM trùng với RAM khác không
      },
    });

    if (ramExists) {
      return res.status(409).json({ error: "Kích thước RAM đã tồn tại" });
    }

    const [updated] = await Ram.update(
      { kich_thuoc_ram },
      { where: { ma_ram: id } }
    );

    if (updated) {
      const updatedRam = await Ram.findOne({ where: { ma_ram: id } });
      res.json(updatedRam);
    } else {
      res.status(404).json({ error: "Không tìm thấy RAM để cập nhật" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật RAM:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật RAM" });
  }
};

// Xóa RAM
exports.deleteRam = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm RAM theo mã
    const ramToDelete = await Ram.findOne({ where: { ma_ram: id } });

    if (!ramToDelete) {
      return res.status(404).json({ error: "RAM không tồn tại" });
    }

    // Cập nhật trạng thái RAM thành 0 (ẩn)
    ramToDelete.trang_thai = 0;
    await ramToDelete.save();

    res.status(200).json({ message: "RAM đã bị ẩn thành công" });
  } catch (error) {
    console.error("Lỗi khi ẩn RAM:", error);
    res.status(500).json({ error: "Lỗi khi ẩn RAM" });
  }
};
