const Product = require("../models/ProductModel");
const OperatingSystem = require("../models/OperatingSystemModel");
const Brand = require("../models/BrandModel");
const Origin = require("../models/OriginModel");
const WareHouse = require("../models/WareHouseModel");
const {
  sequelize,
  PhienBanSPModel,
  Ram,
  Rom,
  Color,
} = require("../models/Relationship");
exports.deleteProduct = async (req, res) => {
  const { ma_sp } = req.params; // Lấy mã sản phẩm từ URL

  try {
    // Tìm sản phẩm theo mã sản phẩm
    const product = await Product.findOne({ where: { ma_sp } });

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    // Cập nhật trạng thái sản phẩm thành 0
    const updatedProduct = await product.update({ trang_thai: 0 });

    if (!updatedProduct) {
      return res
        .status(400)
        .json({ message: "Cập nhật trạng thái sản phẩm không thành công." });
    }

    // Cập nhật trạng thái của các phiên bản sản phẩm trong bảng `phien_ban_san_pham`
    const updatedVariants = await PhienBanSPModel.update(
      { trang_thai: 0 }, // Cập nhật cột `trang_thai` thành 0
      { where: { ma_sp } } // Điều kiện: dựa vào `ma_sp`
    );

    if (updatedVariants[0] === 0) {
      return res.status(400).json({
        message: "Không có phiên bản nào được cập nhật trạng thái.",
      });
    }

    return res.status(200).json({
      message:
        "Sản phẩm và các phiên bản liên quan đã được xóa (trạng thái = 0).",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm và các phiên bản:", error);
    return res
      .status(500)
      .json({ message: "Có lỗi xảy ra khi xóa sản phẩm và các phiên bản." });
  }
};

// Lấy danh sách tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: [
        "ma_sp", // Mã sản phẩm
        "ten_sp", // Tên sản phẩm
        "hinh_anh", // Hình ảnh sản phẩm
        "chip_xu_ly", // Chip xử lý
        "dung_luong_pin", // Dung lượng pin
        "kich_thuoc_man", // Kích thước màn hình
        "camera_truoc", // Camera trước
        "camera_sau", // Camera sau
        "so_luong_ton", // Số lượng tồn
        "mo_ta_sp", // Mô tả sản phẩm
      ],
      where: {
        trang_thai: 1, // Thêm điều kiện trạng thái bằng 1
      },
      include: [
        {
          model: OperatingSystem, // Thêm mô hình hệ điều hành
          as: "operatingSystem", // Alias cho hệ điều hành
          attributes: ["ma_hdh", "ten_hdh"], // Chỉ lấy tên hệ điều hành
        },
        {
          model: Brand, // Thêm mô hình thương hiệu
          as: "brand", // Alias cho thương hiệu
          attributes: ["ma_thuong_hieu", "ten_thuong_hieu"], // Chỉ lấy tên thương hiệu
        },
        {
          model: Origin, // Thêm mô hình xuất xứ
          as: "origin", // Alias cho xuất xứ
          attributes: ["ma_xuat_xu", "ten_xuat_xu"], // Chỉ lấy tên xuất xứ
        },
        {
          model: WareHouse, // Thêm mô hình khu vực kho
          as: "storageArea", // Alias cho khu vực kho
          attributes: ["ma_kho", "ten_kho"], // Chỉ lấy tên khu vực kho
        },
        {
          model: PhienBanSPModel,
          as: "phienBanSanPhams",
          attributes: [
            "ma_phien_ban_sp",
            "gia_nhap",
            "gia_xuat",
            "ton_kho",
            "trang_thai",
          ],
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
          where: {
            trang_thai: 1,
          },
        },
      ],
    });

    // Trả dữ liệu sản phẩm về frontend
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy dữ liệu sản phẩm.",
    });
  }
};

// Hàm thêm sản phẩm mới
exports.addProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Lấy dữ liệu từ body request
    const { productData, configurationsData } = req.body;
    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const existingProduct = await Product.findOne({
      where: {
        ten_sp: productData.ten_sp,
        trang_thai: 1, // Kiểm tra trạng thái sản phẩm
      },
    });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm đã tồn tại!",
      });
    }
    //  Thêm sản phẩm
    const newProduct = await Product.create(productData, { transaction: t });
    const productId = newProduct.ma_sp;
    // Tạo các phiên bản sản phẩm
    const versions = configurationsData.map((version) => ({
      ma_sp: productId,
      ma_ram: parseInt(version.ma_ram, 10),
      ma_rom: parseInt(version.ma_rom, 10),
      ma_mau: parseInt(version.ma_mau, 10),
      gia_nhap: parseInt(version.gia_nhap),
      gia_xuat: parseInt(version.gia_xuat),
      ton_kho: 0,
      trang_thai: 1,
    }));

    // Bulk insert vào bảng phien_ban_san_pham
    await PhienBanSPModel.bulkCreate(versions, { transaction: t });
    await t.commit();
    // Trả về phản hồi thành công
    res.status(201).json({
      success: true,
      message: "Thêm sản phẩm mới thành công.",
      data: newProduct,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);

    // Trả về lỗi
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thêm sản phẩm.",
    });
  }
};

//////////////
exports.getCountProduct = async (req, res) => {
  try {
    const response = await Product.count();
    res.json({ countProduct: response });
  } catch (error) {
    console.error("fail count product", error);
    throw error;
  }
};

exports.updateProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productData, configurationsData } = req.body;
    const { ma_sp } = req.params;
    const product = await Product.findByPk(ma_sp);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }
     // Update product details
     await product.update(productData, { transaction: t });

     const configPromises = configurationsData.map(async (config) => {
      const existingConfig = await PhienBanSPModel.findOne({
        where: {
          ma_sp,
          ma_ram: config.ma_ram,
          ma_rom: config.ma_rom,
          ma_mau: config.ma_mau,
        },
      });

      if (existingConfig) {
        // Update existing configuration
        return existingConfig.update(
          {
            gia_nhap: config.gia_nhap,
            gia_xuat: config.gia_xuat,
            
          },
          { transaction: t }
        );
      } else {
        // Create new configuration
        return PhienBanSPModel.create(
          {
            ma_sp,
            ...config,
          },
          { transaction: t }
        );
      }
    });

    await Promise.all(configPromises); // Execute all promises
    await t.commit(); // Commit transaction

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công!",
    });
  } catch (error) {
    await t.rollback();
    console.error(error);

    // Trả về lỗi
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thêm sản phẩm.",
    });
  }
};
exports.updatedCountProduct = async (req, res) => {
  const { ma_sp } = req.params;
  const { so_luong_moi } = req.body;
  try {
    const Prd = await Product.findByPk(ma_sp);
    if (!Prd)
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    const newSL = Prd.so_luong_ton + so_luong_moi;
    Prd.so_luong_ton = newSL;
    await Prd.save();
    res
      .status(200)
      .json({ message: "Cập nhật số lượng tồn kho sản phẩm thành công" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi khi cập nhật số lượng tồn kho!" });
  }
};

exports.updateWarehouseProduct = async (req, res) => {
  const { ma_sp } = req.params;
  const { ma_kho } = req.body;
  try {
    const product = await Product.findByPk(ma_sp);
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    product.khu_vuc_kho = ma_kho;
    await product.save();
    res.status(200).json({ message: "Cập nhật khu vực kho thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật khu vực kho" });
  }
};
