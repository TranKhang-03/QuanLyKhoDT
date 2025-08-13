const Origin = require("../models/OriginModel");
const { Op } = require("sequelize");

// Lấy tất cả xuất xứ
exports.getAllOrigins = async (req, res) => {
  try {
    const origins = await Origin.findAll({
      attributes: ["ma_xuat_xu", "ten_xuat_xu"],
      where: {
        trang_thai: 1,
      },
    });
    res.json(origins);
  } catch (error) {
    console.error("Lỗi khi lấy xuất xứ:", error);
    res.status(500).json({ error: "Lỗi khi lấy xuất xứ" });
  }
};

// Thêm xuất xứ mới
exports.addOrigin = async (req, res) => {
  const { ten_xuat_xu } = req.body;

  try {
    const originExists = await Origin.findOne({
      where: { ten_xuat_xu, trang_thai: 1 },
    });
    if (originExists) {
      return res.status(409).json({ error: "Tên xuất xứ đã tồn tại" });
    }

    const newOrigin = await Origin.create({ ten_xuat_xu });
    res.status(201).json(newOrigin);
  } catch (error) {
    console.error("Lỗi khi thêm xuất xứ:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật xuất xứ
exports.updateOrigin = async (req, res) => {
  const { id } = req.params;
  const { ten_xuat_xu } = req.body;

  if (!ten_xuat_xu || ten_xuat_xu.trim() === "") {
    return res.status(400).json({ error: "Tên xuất xứ không được để trống" });
  }

  try {
    const originExists = await Origin.findOne({
      where: {
        ten_xuat_xu,
        ma_xuat_xu: { [Op.ne]: id },
      },
    });

    if (originExists) {
      return res.status(409).json({ error: "Tên xuất xứ đã tồn tại" });
    }

    const [updated] = await Origin.update(
      { ten_xuat_xu },
      { where: { ma_xuat_xu: id } }
    );

    if (updated) {
      const updatedOrigin = await Origin.findOne({
        where: { ma_xuat_xu: id },
      });
      res.json(updatedOrigin);
    } else {
      res.status(404).json({ error: "Không tìm thấy xuất xứ để cập nhật" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật xuất xứ:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa xuất xứ

exports.deleteOrigin = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  try {
    const originToDelete = await Origin.findOne({
      where: { ma_xuat_xu: id },
    });

    if (!originToDelete) {
      return res.status(404).json({ error: "Xuất xứ không tồn tại" });
    }

    originToDelete.trang_thai = trang_thai || 0;

    await originToDelete.save();

    res.status(200).json({ message: "Xuất xứ đã được ẩn thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa xuất xứ:", error);
    res.status(500).json({ error: "Lỗi khi ẩn xuất xứ" });
  }
};
