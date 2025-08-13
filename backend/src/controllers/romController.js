const Rom = require("../models/RomModel");
const { Op } = require("sequelize");

// Lấy tất cả ROM
exports.getAllRoms = async (req, res) => {
  try {
    const roms = await Rom.findAll({
      attributes: ["ma_rom", "kich_thuoc_rom"], // Lấy các thuộc tính của ROM
      where: {
        trang_thai: 1,
      },
    });
    res.json(roms);
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu ROM:", error);
    res.status(500).json({ error: "Lỗi khi lấy dữ liệu ROM" });
  }
};

// Thêm ROM mới
exports.addRom = async (req, res) => {
  const { kich_thuoc_rom } = req.body;

  // Kiểm tra xem kích thước ROM có hợp lệ không
  if (!kich_thuoc_rom || kich_thuoc_rom.trim() === "") {
    return res
      .status(400)
      .json({ error: "Kích thước ROM không được để trống" });
  }

  try {
    // Kiểm tra xem kích thước ROM đã tồn tại chưa
    const romExists = await Rom.findOne({
      where: { kich_thuoc_rom, trang_thai: 1 },
    });
    if (romExists) {
      return res.status(409).json({ error: "Kích thước ROM đã tồn tại" });
    }

    // Tạo ROM mới
    const newRom = await Rom.create({ kich_thuoc_rom });
    res.status(201).json(newRom); // Trả về ROM vừa thêm vào
  } catch (error) {
    console.error("Lỗi khi thêm ROM:", error.message);
    res.status(500).json({ error: "Lỗi khi thêm ROM" });
  }
};

// Cập nhật ROM
exports.updateRom = async (req, res) => {
  const { id } = req.params;
  const { kich_thuoc_rom } = req.body;

  // Kiểm tra xem kích thước ROM có hợp lệ không
  if (!kich_thuoc_rom || kich_thuoc_rom.trim() === "") {
    return res
      .status(400)
      .json({ error: "Kích thước ROM không được để trống" });
  }

  try {
    // Kiểm tra xem kích thước ROM mới đã tồn tại trong hệ thống chưa
    const romExists = await Rom.findOne({
      where: {
        kich_thuoc_rom,
        ma_rom: { [Op.ne]: id }, // Kiểm tra xem ROM có trùng kích thước nhưng có ID khác không
      },
    });

    if (romExists) {
      return res.status(409).json({ error: "Kích thước ROM đã tồn tại" });
    }

    // Cập nhật ROM
    const [updated] = await Rom.update(
      { kich_thuoc_rom },
      { where: { ma_rom: id } }
    );

    // Nếu có ROM được cập nhật, trả về thông tin ROM đã cập nhật
    if (updated) {
      const updatedRom = await Rom.findOne({ where: { ma_rom: id } });
      res.json(updatedRom);
    } else {
      res.status(404).json({ error: "Không tìm thấy ROM để cập nhật" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật ROM:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật ROM" });
  }
};

// Xóa ROM
exports.deleteRom = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm ROM theo mã
    const romToDelete = await Rom.findOne({ where: { ma_rom: id } });
    if (!romToDelete) {
      return res.status(404).json({ error: "ROM không tồn tại" });
    }

    // Cập nhật trạng thái ROM thành 0 (ẩn)
    romToDelete.trang_thai = 0;
    await romToDelete.save();

    res.status(200).json({ message: "ROM đã bị ẩn thành công" });
  } catch (error) {
    console.error("Lỗi khi ẩn ROM:", error);
    res.status(500).json({ error: "Lỗi khi ẩn ROM" });
  }
};
