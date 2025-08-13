const Employee = require("../models/EmployeeModel");
const Permission = require("../models/permissionModel");
const FeaturePermission = require("../models/FeaturePermissionModel");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

exports.compareAccount = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employee = await Employee.findOne({
      where: {
        ma_nv: username,
        mat_khau: password,
        trang_thai: {
          [Op.ne]: 0,
        },
      },
    });
    if (!employee) {
      console.log("tai khoan khong hop le");
    }
    if (employee) {
      const token = jwt.sign(
        { username: username, password: password },
        "accountLogin"
      );
      res.cookie("token", token);
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: "tai khoan khong hop le", error });
  }
};

exports.checkUsername = async (req, res) => {
  const { username } = req.body;
  try {
    const employeeID = await Employee.findOne({
      where: {
        ma_nv: username,
      },
    });
    if (!employeeID) {
      console.log("ten tai khoan khong ton tai");
    }
    res.json(employeeID);
  } catch (error) {
    res.status(500).json({ error: "ten tai khoan khong hop le", error });
  }
};

exports.checkEmailToRecoveryPassword = async (req, res) => {
  const { email } = req.body;
  console.log("email", email);
  try {
    const employeeID = await Employee.findOne({
      where: {
        email: email,
      },
    });
    if (!employeeID) {
      console.log("email khong ton tai");
      res.json(employeeID);
    }
    if (employeeID) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "doancnpmnhom2@gmail.com",
          pass: "epan zdll ctnb wcul",
        },
      });

      transporter.sendMail(
        {
          from: '"TEAM 2" <doancnpmnhom2@gmail.com>',
          to: email,
          subject: "Lấy lại mật khẩu",
          html: `<b>Mật khẩu đăng nhập của bạn là: ${employeeID.mat_khau}</b>`,
        },
        (err) => {
          if (err) {
            return console.log("Lỗi khi gửi email:", err);
          }
          console.log("Gửi email thành công");
        }
      );
      res.json(employeeID);
    }
  } catch (error) {
    res.status(500).json({ error: "email khong hop le", error });
  }
};

exports.getFeatureFromToken = async (req, res) => {
  const token = req.cookies.token;
  try {
    const decode = jwt.verify(token, "accountLogin");
    const permission = await Employee.findOne({
      include: [
        {
          model: Permission,
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
        },
      ],
      attributes: ["ma_nv", "ten_nv", "email"],
      where: {
        ma_nv: decode.username,
      },
    });
    const formattedPermission = permission.Permission.FeaturePermissions.map(
      (item) => ({
        ten_chuc_nang: item.ten_chuc_nang,
      })
    );
    res.json(formattedPermission);
  } catch (error) {
    res.status(500).json({ error: "lay chuc nang tu token bi loi", error });
  }
};
