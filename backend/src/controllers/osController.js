const OperatingSystem = require("../models/OperatingSystemModel");
const { Op } = require("sequelize");

// Lấy tất cả hệ điều hành
exports.getAllOperatingSystems = async (req, res) => {
  try {
    const operatingSystems = await OperatingSystem.findAll({
      attributes: ["ma_hdh", "ten_hdh"],
      where: {
        trang_thai: 1,
      },
    });
    res.json(operatingSystems);
  } catch (error) {
    console.error("Lỗi khi lấy hệ điều hành:", error);
    res.status(500).json({ error: "Lỗi khi lấy hệ điều hành" });
  }
};

// Thêm hệ điều hành mới
exports.addOperatingSystem = async (req, res) => {
  const { ten_hdh } = req.body;

  try {
    const osExists = await OperatingSystem.findOne({
      where: { ten_hdh, trang_thai: 1 },
    });
    if (osExists) {
      return res.status(409).json({ error: "Tên hệ điều hành đã tồn tại" });
    }

    const newOperatingSystem = await OperatingSystem.create({ ten_hdh });
    res.status(201).json(newOperatingSystem);
  } catch (error) {
    console.error("Lỗi khi thêm hệ điều hành:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật hệ điều hành
exports.updateOperatingSystem = async (req, res) => {
  const { id } = req.params;
  const { ten_hdh } = req.body;

  if (!ten_hdh || ten_hdh.trim() === "") {
    return res
      .status(400)
      .json({ error: "Tên hệ điều hành không được để trống" });
  }

  try {
    const osExists = await OperatingSystem.findOne({
      where: {
        ten_hdh,
        ma_hdh: { [Op.ne]: id },
      },
    });

    if (osExists) {
      return res.status(409).json({ error: "Tên hệ điều hành đã tồn tại" });
    }

    const [updated] = await OperatingSystem.update(
      { ten_hdh },
      { where: { ma_hdh: id } }
    );

    if (updated) {
      const updatedOperatingSystem = await OperatingSystem.findOne({
        where: { ma_hdh: id },
      });
      res.json(updatedOperatingSystem);
    } else {
      res
        .status(404)
        .json({ error: "Không tìm thấy hệ điều hành để cập nhật" });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật hệ điều hành:", error);
    res.status(500).json({ error: error.message });
  }
};

// Xóa hệ điều hành
exports.deleteOperatingSystem = async (req, res) => {
  const { id } = req.params;
  const { trang_thai } = req.body;

  try {
    const operatingSystemToDelete = await OperatingSystem.findOne({
      where: { ma_hdh: id },
    });

    if (!operatingSystemToDelete) {
      return res.status(404).json({ error: "Hệ điều hành không tồn tại" });
    }

    // Cập nhật trạng thái hệ điều hành thành 0 (ẩn)
    operatingSystemToDelete.set("trang_thai", trang_thai || 0);

    await operatingSystemToDelete.save();

    res.status(200).json({ message: "Hệ điều hành đã được ẩn thành công" });
  } catch (error) {
    console.error("Lỗi khi ẩn hệ điều hành:", error);
    res.status(500).json({ error: "Lỗi khi ẩn hệ điều hành" });
  }
};
