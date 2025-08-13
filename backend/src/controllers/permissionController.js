const Permission = require("../models/permissionModel");
const Employee = require("../models/EmployeeModel");
const FeaturePermission = require("../models/FeaturePermissionModel");
const DetailPermission = require("../models/DetailPermission");


exports.getPermissionByMaQuyen = async (req, res) => {
  const { ma_quyen } = req.params; // Lấy ma_quyen từ tham số URL
  
  try {
    // Lấy thông tin quyền từ bảng Permission
    const permission = await Permission.findOne({
      where: { ma_quyen: ma_quyen },
      attributes: ['ma_quyen', 'ten_quyen'], // Chỉ lấy ma_quyen và ten_quyen
    });

    // Kiểm tra nếu không tìm thấy quyền nào
    if (!permission) {
      return res.status(404).json({ message: "Không tìm thấy quyền với ma_quyen: " + ma_quyen });
    }

    // Trả kết quả về cho client
    res.json(permission);

  } catch (error) {
    res.status(500).json({ error: "Có lỗi khi lấy thông tin quyền", error });
  }
};

exports.showAllPermission = async (req, res) => {
  try {
    const permission = await Employee.findAll({
      include: [
        {
          model: Permission,
          include: [
            {
              model: FeaturePermission,
              through: {
                attributes: [],
              },
              attributes: [],
            },
          ],
          attributes: ["ma_quyen", "ten_quyen"],
        },
      ],
      attributes: ["ma_nv", "ten_nv", "email", "trang_thai"],
    });
    const formattedResult = permission.map((item) => ({
      ma_nv: item.ma_nv,
      ten_nv: item.ten_nv,
      email: item.email,
      trang_thai: item.trang_thai,
      ma_quyen: item.Permission ? item.Permission.ma_quyen : null,
      ten_quyen: item.Permission ? item.Permission.ten_quyen : null,
    }));
    res.json(formattedResult);
    // const permission = await Employee.findOne({ where: { ma_nv: "admin" } });
    // res.json(permission);
  } catch (error) {
    res.status(500).json({ error: "co loi khi tim", error });
  }
};

exports.showAllFeature = async (req, res) => {
  try {
    const feature = await Permission.findAll({
      include: [
        {
          model: FeaturePermission,
          through: {
            attributes: [],
          },
          attributes: ["ten_chuc_nang"],
        },
      ],
      attributes: ["ma_quyen", "ten_quyen"],
    });
    res.json(feature);
  } catch (error) {
    res.status(500).json({ error: "co loi khi tim chuc nang", error });
  }
};

exports.changeRole = async (req, res) => {
  const { ma_quyen } = req.params;
  const { listFeature } = req.body;
  let hanh_dong;
  console.log(listFeature, ma_quyen);
  try {
    const feature = await DetailPermission.findAll({
      where: { ma_quyen: ma_quyen },
    });
    console.log(JSON.stringify(feature, null, 2));
    if (feature.length > 0) {
      await DetailPermission.destroy({
        where: {
          ma_quyen: ma_quyen,
        },
      });
      console.log("successfull");
    }
    if (ma_quyen === "1" || ma_quyen === "2" || ma_quyen === "3") {
      hanh_dong = "Thêm, sửa, xóa, xem";
    } else if (ma_quyen === "4") {
      hanh_dong = "xem";
    }
    console.log("hanh dong:", hanh_dong, typeof ma_quyen)
    const createPromises = listFeature.map((ma_chuc_nang) => {
      return DetailPermission.create({
        ma_quyen,
        ma_chuc_nang,
        hanh_dong,
      });
    });
    await Promise.all(createPromises);
    console.log("Tạo thành công");
    res.json("Thay doi thanh cong");
  } catch (error) {
    res.status(500).json("loi khi thay doi chuc nang cua quyen:", error);
  }
};

exports.updateRole = async (req, res) => {
  const { ma_nv } = req.params;
  const { ma_quyen } = req.body;
  try {
    const employee = await Employee.findByPk(ma_nv);
    if (!employee) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    // console.log(employee)
    employee.trang_thai = 1;
    employee.ma_quyen = ma_quyen;
    await employee.save();
    console.log(ma_nv, ma_quyen);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "loi khi update vai tro cua nhan vien" });
  }
};

exports.deleteRole = async (req, res) => {
  const { ma_nv } = req.params;
  console.log(ma_nv);
  try {
    const employee = await Employee.findByPk(ma_nv);
    // employee.ma_quyen = null;
    employee.trang_thai = 0;
    await employee.save();
    res.json("da xoa thanh cong");
  } catch (error) {
    res.status(500).json({ error: "loi khi xoa nhan vien" });
  }
};
