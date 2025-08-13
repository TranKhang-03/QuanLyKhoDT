const { Op, literal } = require("sequelize");
const {
  KhachHang,
  PhieuXuat,
  Provider,
  importModel,
  PhienBanSPModel,
  chiTietPhieuXuatModel,
  detailImport,
  Ram,
  Rom,
  Color,
  ProductModel,
  sequelize,
} = require("../models/Relationship");

const getThongKeKhachHang = async (req, res) => {
  const { text, timeStart, timeEnd } = req.query;
  try {
    const whereConditions = {
      [Op.and]:[{
        [Op.or]: [
          { ten_kh: { [Op.like]: `%${text || ""}%` } },
          { ma_kh: { [Op.like]: `%${text || ""}%` } },
        ]}, 
        { trang_thai: 1 },
    ],
      
    };
    const phieuXuatConditions = {};
    if (timeStart && timeEnd) {
      phieuXuatConditions.thoi_gian_xuat = {
        [Op.between]: [new Date(timeStart), new Date(timeEnd)],
      };
    }
    const results = await KhachHang.findAll({
      attributes: [
        "ma_kh",
        "ten_kh",
        [sequelize.fn("COUNT", sequelize.col("phieuXuats.ma_px")), "SoLuong"],
        [sequelize.fn("SUM", sequelize.col("phieuXuats.tong_tien")), "total"],
      ],
      include: [
        {
          model: PhieuXuat,
          as: "phieuXuats",
          attributes: [],
          where: phieuXuatConditions,
        },
      ],
      where: whereConditions,
      group: ["customer.ma_kh", "customer.ten_kh"],
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching customer statistics" });
  }
};

const getThongKeProvider = async (req, res) => {
  const { text, timeStart, timeEnd } = req.query;
  try {
    const whereCondition = {
      [Op.or]: [
        { ten_ncc: { [Op.like]: `%${text || ""}%` } },
        { ma_ncc: { [Op.like]: `%${text || ""}%` } },
      ],
    };
    const phieuNhapCondition = {};
    if (timeStart && timeEnd) {
      phieuNhapCondition.thoi_gian_nhap = {
        [Op.between]: [new Date(timeStart), new Date(timeEnd)],
      };
    }
    const results = await Provider.findAll({
      attributes: [
        "ma_ncc",
        "ten_ncc",
        [sequelize.fn("COUNT", sequelize.col("phieuNhaps.ma_pn")), "SoLuong"],
        [sequelize.fn("SUM", sequelize.col("phieuNhaps.tong_tien")), "total"],
      ],
      include: [
        {
          model: importModel,
          as: "phieuNhaps",
          attributes: [],
          where: phieuNhapCondition,
        },
      ],
      where: whereCondition,
      group: ["provider.ma_ncc", "provider.ten_ncc"],
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching provider statistics" });
  }
};
const getThongKeNhapXuat = async (req, res) => {
  const { text, timeStart, timeEnd } = req.query;
  try {
    // Điều kiện tìm kiếm theo text
    const TextCondition = text
      ? {
          [Op.or]: [
            { "$product.ten_sp$": { [Op.like]: `%${text || ""}%` } },
            { "$product.ma_sp$": { [Op.like]: `%${text || ""}%` } },
          ],
        }
      : {};

    // Điều kiện tìm kiếm theo thời gian
    const timeConditionNhap =
      timeStart && timeEnd
        ? `AND phieu_nhap.thoi_gian_nhap BETWEEN '${timeStart}' AND '${timeEnd}'`
        : "";
    const timeConditionXuat =
      timeStart && timeEnd
        ? `AND phieu_xuat.thoi_gian_xuat BETWEEN '${timeStart}' AND '${timeEnd}'`
        : "";

    const results = await PhienBanSPModel.findAll({
      attributes: [
        
        "ma_sp",
        "ma_phien_ban_sp",
        [sequelize.col("product.ten_sp"), "ten_sp"],
      
        // Số lượng đầu kỳ
        [
          sequelize.literal(`(
              SELECT COALESCE(SUM(nhapDau.so_luong), 0) - COALESCE(SUM(xuatDau.so_luong), 0)
              FROM chi_tiet_phieu_nhap AS nhapDau
              INNER JOIN phieu_nhap AS phieuNhap  ON nhapDau.ma_pn = phieuNhap.ma_pn
              LEFT JOIN chi_tiet_phieu_xuat AS xuatDau  
              ON nhapDau.ma_phien_ban_sp = xuatDau.ma_phien_ban_sp
              WHERE nhapDau.ma_phien_ban_sp = PhienBanSPModel.ma_phien_ban_sp
              AND phieuNhap.thoi_gian_nhap < '${timeStart || "1900-01-01"}'
            )`),
          "so_luong_dau_ky",
        ],
        // Số lượng nhập trong kỳ
        [
          sequelize.literal(`(
              SELECT COALESCE(SUM(so_luong), 0)
              FROM chi_tiet_phieu_nhap
              INNER JOIN phieu_nhap 
              ON phieu_nhap.ma_pn = chi_tiet_phieu_nhap.ma_pn
              WHERE chi_tiet_phieu_nhap.ma_phien_ban_sp = PhienBanSPModel.ma_phien_ban_sp
              ${timeConditionNhap}
            )`),
          "so_luong_nhap",
        ],
        // Số lượng xuất trong kỳ
        [
          sequelize.literal(`(
              SELECT COALESCE(SUM(so_luong), 0)
              FROM chi_tiet_phieu_xuat
              INNER JOIN phieu_xuat 
              ON phieu_xuat.ma_px = chi_tiet_phieu_xuat.ma_px
             
              WHERE chi_tiet_phieu_xuat.ma_phien_ban_sp = PhienBanSPModel.ma_phien_ban_sp
              ${timeConditionXuat}
            )`),
          "so_luong_xuat",
        ],
        // Số lượng cuối kỳ
        [
          sequelize.literal(`(
              (SELECT COALESCE(SUM(nhapDau.so_luong), 0) - COALESCE(SUM(xuatDau.so_luong), 0)
               FROM chi_tiet_phieu_nhap AS nhapDau
               INNER JOIN phieu_nhap AS phieuNhap  ON nhapDau.ma_pn = phieuNhap.ma_pn
               LEFT JOIN chi_tiet_phieu_xuat AS xuatDau
               ON nhapDau.ma_phien_ban_sp = xuatDau.ma_phien_ban_sp
               
               WHERE nhapDau.ma_phien_ban_sp = PhienBanSPModel.ma_phien_ban_sp
               AND phieuNhap.thoi_gian_nhap < '${timeStart || "1900-01-01"}')
              +
              (SELECT COALESCE(SUM(so_luong), 0)
               FROM chi_tiet_phieu_nhap
               INNER JOIN phieu_nhap 
               ON phieu_nhap.ma_pn = chi_tiet_phieu_nhap.ma_pn
            
              WHERE chi_tiet_phieu_nhap.ma_phien_ban_sp = PhienBanSPModel.ma_phien_ban_sp
               ${timeConditionNhap})
              -
              (SELECT COALESCE(SUM(so_luong), 0)
               FROM chi_tiet_phieu_xuat
               INNER JOIN phieu_xuat 
               ON phieu_xuat.ma_px = chi_tiet_phieu_xuat.ma_px
               WHERE chi_tiet_phieu_xuat.ma_phien_ban_sp = PhienBanSPModel.ma_phien_ban_sp
               ${timeConditionXuat})
            )`),
          "so_luong_cuoi_ky",
        ],
        
      ],
      where: TextCondition,
      include: [
        { model: ProductModel, as: "product", attributes: [] },
        {model: Ram, as:"ram", attributes: ["kich_thuoc_ram"] },
        {model: Rom, as:"rom", attributes: ["kich_thuoc_rom"] },
        {model: Color, as:"mauSac", attributes: ["ten_mau"] },
      ],
      // group: ["ma_sp", "product.ten_sp"],
      order: [["ma_sp", "ASC"], ["ma_phien_ban_sp", "ASC"]],
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching inventory statistics" });
  }
};
const getThongKeTheoNam = async (req, res) => {
  try {
    let { yearStart, yearEnd } = req.query;
    // Parse năm bắt đầu và năm kết thúc từ query
    let startYear = yearStart ? parseInt(yearStart, 10) : null;
    let endYear = yearEnd ? parseInt(yearEnd, 10) : null;

    // Nếu không có năm bắt đầu và kết thúc, tự động lấy khoảng năm từ database
    if (!startYear && !endYear) {
      const yearsRange = await PhieuXuat.findAll({
        attributes: [
          [
            sequelize.fn(
              "MIN",
              sequelize.fn("YEAR", sequelize.col("thoi_gian_xuat"))
            ),
            "minYear",
          ],
          [
            sequelize.fn(
              "MAX",
              sequelize.fn("YEAR", sequelize.col("thoi_gian_xuat"))
            ),
            "maxYear",
          ],
        ],
        raw: true,
      });

      // Nếu không có dữ liệu trong database
      if (yearsRange.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy dữ liệu năm trong database." });
      }

      startYear = yearsRange[0].minYear || new Date().getFullYear();
      endYear = yearsRange[0].maxYear || new Date().getFullYear();
    }
    // Nếu chỉ có `startYear`, đặt `endYear` là năm hiện tại
    if (startYear && !endYear) {
      endYear = new Date().getFullYear();
    }
    // Nếu chỉ có `endYear`, đặt `startYear` là năm nhỏ nhất trong database
    if (!startYear && endYear) {
      const minYearData = await PhieuXuat.findOne({
        attributes: [
          [
            sequelize.fn(
              "MIN",
              sequelize.fn("YEAR", sequelize.col("thoi_gian_xuat"))
            ),
            "minYear",
          ],
        ],
        raw: true,
      });

      startYear = minYearData.minYear || endYear;
    }
    // Tạo danh sách các năm trong khoảng
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    // Thực hiện truy vấn cho từng năm
    const results = await Promise.all(
      years.map(async (year) => {
        // Tính chi phí (dựa vào importModel -> detailImport -> PhienBanSPModel)
        const chiphi = await detailImport.findAll({
          attributes: [[sequelize.literal("SUM(so_luong*gia_nhap)"), "chiphi"]],
          include: [
            {
              model: importModel,
              as: "phieuNhap",
              attributes: [],
              where: sequelize.where(
                sequelize.fn("YEAR", sequelize.col("thoi_gian_nhap")),
                year
              ),
            },
          ],
          raw: true,
        });

        // Tính doanh thu (dựa vào chiTietPhieuXuatModel -> PhieuXuat)
        const doanhthu = await chiTietPhieuXuatModel.findAll({
          attributes: [
            [sequelize.literal("SUM(so_luong*gia_xuat)"), "doanhthu"],
          ],
          include: [
            {
              model: PhieuXuat,
              as: "phieuXuat",
              attributes: [],
              where: sequelize.where(
                sequelize.fn("YEAR", sequelize.col("thoi_gian_xuat")),
                year
              ),
            },
          ],
          raw: true,
        });

        // Giá trị chi phí và doanh thu
        const chiphiValue = parseFloat(chiphi[0]?.chiphi || 0);
        const doanhthuValue = parseFloat(doanhthu[0]?.doanhthu || 0);

        // Trả về kết quả từng năm
        return {
          nam: year,
          chiphi: chiphiValue,
          doanhthu: doanhthuValue,
          loi_nhuan: doanhthuValue - chiphiValue,
        };
      })
    );

    // Trả về kết quả
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình thống kê." });
  }
};
const getThongKeTheoThang = async (req, res) => {
  try {
    const { year } = req.query;
    let Year = year ? parseInt(year, 10) : null;
    // Nếu không có `year`, lấy năm mới nhất từ bảng `PhieuXuat`
    if (!Year) {
      const latestYearData = await PhieuXuat.findOne({
        attributes: [
          [
            sequelize.fn(
              "MAX",
              sequelize.fn("YEAR", sequelize.col("thoi_gian_xuat"))
            ),
            "latestYear",
          ],
        ],
        raw: true,
      });

      // Nếu không tìm thấy dữ liệu
      if (!latestYearData || !latestYearData.latestYear) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy dữ liệu năm trong cơ sở dữ liệu." });
      }

      // Gán `year` là năm mới nhất
      Year = latestYearData.latestYear;
    }

    // Tạo danh sách các tháng (1 đến 12)
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    // Thực hiện truy vấn cho từng tháng
    const results = await Promise.all(
      months.map(async (month) => {
        // Tính chi phí (dựa vào detailImport -> importModel)
        const chiphi = await detailImport.findAll({
          attributes: [
            [sequelize.literal("SUM(so_luong * gia_nhap)"), "chiphi"],
          ],
          include: [
            {
              model: importModel,
              as: "phieuNhap",
              attributes: [],
              where: {
                [Op.and]: [
                  sequelize.where(
                    sequelize.fn("YEAR", sequelize.col("thoi_gian_nhap")),
                    year
                  ),
                  sequelize.where(
                    sequelize.fn("MONTH", sequelize.col("thoi_gian_nhap")),
                    month
                  ),
                ],
              },
            },
          ],
          raw: true,
        });

        // Tính doanh thu (dựa vào chiTietPhieuXuatModel -> PhieuXuat)
        const doanhthu = await chiTietPhieuXuatModel.findAll({
          attributes: [
            [sequelize.literal("SUM(so_luong * gia_xuat)"), "doanhthu"],
          ],
          include: [
            {
              model: PhieuXuat,
              as: "phieuXuat",
              attributes: [],
              where: {
                [Op.and]: [
                  sequelize.where(
                    sequelize.fn("YEAR", sequelize.col("thoi_gian_xuat")),
                    year
                  ),
                  sequelize.where(
                    sequelize.fn("MONTH", sequelize.col("thoi_gian_xuat")),
                    month
                  ),
                ],
              },
            },
          ],
          raw: true,
        });

        // Giá trị chi phí và doanh thu
        const chiphiValue = parseFloat(chiphi[0]?.chiphi || 0);
        const doanhthuValue = parseFloat(doanhthu[0]?.doanhthu || 0);

        // Trả về kết quả từng tháng
        return {
          nam: Year,
          thang: month,
          chiphi: chiphiValue,
          doanhthu: doanhthuValue,
          loi_nhuan: doanhthuValue - chiphiValue,
        };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Lỗi trong quá trình thống kê theo tháng:", error);
    res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình thống kê." });
  }
};
const getThongKeTheoNgay = async (req, res) => {
  try {
    const { year, month } = req.query;

    // Lấy ngày hiện tại làm mặc định
    const today = new Date();
    const Year = year ? parseInt(year, 10) : today.getFullYear();
    const Month = month ? parseInt(month, 10) : today.getMonth() + 1;
    if (Month < 1 || Month > 12) {
      return res.status(400).json({
        message: "Vui lòng cung cấp year và month hợp lệ (month: 1-12).",
      });
    }
    // Đảm bảo chỉ lấy các ngày từ ngày 1 đến ngày cuối cùng của tháng
    const daysInMonth = new Date(Year, Month, 0).getDate(); // Lấy số ngày của tháng
    const days = Array.from(
      { length: daysInMonth },
      (_, i) =>
        `${Year}-${String(Month).padStart(2, "0")}-${String(i + 1).padStart(
          2,
          "0"
        )}` // Tạo danh sách ngày định dạng YYYY-MM-DD
    );
    // Lấy thống kê cho từng ngày
    const results = await Promise.all(
      days.map(async (formattedDate) => {
        // Tính chi phí trong ngày
        const chiphi = await detailImport.findAll({
          attributes: [[literal("SUM(so_luong * gia_nhap)"), "chiphi"]],
          include: [
            {
              model: importModel,
              as: "phieuNhap",
              attributes: [],
              where: {
                thoi_gian_nhap: {
                  [Op.between]: [
                    `${formattedDate} 00:00:00`,
                    `${formattedDate} 23:59:59`,
                  ],
                },
              },
            },
          ],
          raw: true,
        });

        // Tính doanh thu trong ngày
        const doanhthu = await chiTietPhieuXuatModel.findAll({
          attributes: [[literal("SUM(so_luong * gia_xuat)"), "doanhthu"]],
          include: [
            {
              model: PhieuXuat,
              as: "phieuXuat",
              attributes: [],
              where: {
                thoi_gian_xuat: {
                  [Op.between]: [
                    `${formattedDate} 00:00:00`,
                    `${formattedDate} 23:59:59`,
                  ],
                },
              },
            },
          ],
          raw: true,
        });

        // Tính toán kết quả
        const chiphiValue = parseFloat(chiphi[0]?.chiphi || 0);
        const doanhthuValue = parseFloat(doanhthu[0]?.doanhthu || 0);
        const loiNhuan = doanhthuValue - chiphiValue;

        // Trả về kết quả cho ngày
        return {
          nam: Year,
          thang: Month,
          ngay: formattedDate,
          chiphi: chiphiValue,
          doanhthu: doanhthuValue,
          loi_nhuan: loiNhuan,
        };
      })
    );
    res.status(200).json(results);
    }catch (error) {
      console.error("Lỗi trong quá trình thống kê theo ngày trong tháng:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình thống kê." });
    }
  }
const getThongKe7NgayGanNhat = async (req, res) => { 
  try {
    const today = new Date();
    const sevenDays = new Date(today);
    sevenDays.setDate(today.getDate() - 7);
    const days=[];
    for(let d=new Date(sevenDays);d <= today; d.setDate(d.getDate() + 1)){
      days.push(d.toISOString().slice(0,10));
    };
    // Lấy thống kê cho từng ngày
    const results = await Promise.all(
      days.map(async (formattedDate) => {
        // Tính chi phí trong ngày
        const chiphi = await detailImport.findAll({
          attributes: [[literal("SUM(so_luong * gia_nhap)"), "chiphi"]],
          include: [
            {
              model: importModel,
              as: "phieuNhap",
              attributes: [],
              where: {
                thoi_gian_nhap: {
                  [Op.between]: [
                    `${formattedDate} 00:00:00`,
                    `${formattedDate} 23:59:59`,
                  ],
                },
              },
            },
          ],
          raw: true,
        });

        // Tính doanh thu trong ngày
        const doanhthu = await chiTietPhieuXuatModel.findAll({
          attributes: [[literal("SUM(so_luong * gia_xuat)"), "doanhthu"]],
          include: [
            {
              model: PhieuXuat,
              as: "phieuXuat",
              attributes: [],
              where: {
                thoi_gian_xuat: {
                  [Op.between]: [
                    `${formattedDate} 00:00:00`,
                    `${formattedDate} 23:59:59`,
                  ],
                },
              },
            },
          ],
          raw: true,
        });

        // Tính toán kết quả
        const chiphiValue = parseFloat(chiphi[0]?.chiphi || 0);
        const doanhthuValue = parseFloat(doanhthu[0]?.doanhthu || 0);
        const loiNhuan = doanhthuValue - chiphiValue;

        // Trả về kết quả cho ngày
        return {
          ngay: formattedDate,
          chiphi: chiphiValue,
          doanhthu: doanhthuValue,
          loi_nhuan: loiNhuan,
        };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Lỗi trong quá trình thống kê 7 ngày gần nhất:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình thống kê." });
  }
}
const getThongKeNgayDenNgay= async (req, res) => {
  try {
    const {start,end} = req.query;
    const today = new Date();
    let startDate= start ? new Date(start) : new Date(today.setDate(today.getDate()-15));
    let endDate= end ? new Date(end) : new Date();
    const days=[];
    for(let d=new Date(startDate); d<=endDate; d.setDate(d.getDate()+1) ) {
      days.push(d.toISOString().slice(0,10));
    }
     // Lấy thống kê cho từng ngày
     const results = await Promise.all(
      days.map(async (formattedDate) => {
        // Tính chi phí trong ngày
        const chiphi = await detailImport.findAll({
          attributes: [[literal("SUM(so_luong * gia_nhap)"), "chiphi"]],
          include: [
            {
              model: importModel,
              as: "phieuNhap",
              attributes: [],
              where: {
                thoi_gian_nhap: {
                  [Op.between]: [
                    `${formattedDate} 00:00:00`,
                    `${formattedDate} 23:59:59`,
                  ],
                },
              },
            },
          ],
          raw: true,
        });

        // Tính doanh thu trong ngày
        const doanhthu = await chiTietPhieuXuatModel.findAll({
          attributes: [[literal("SUM(so_luong * gia_xuat)"), "doanhthu"]],
          include: [
            {
              model: PhieuXuat,
              as: "phieuXuat",
              attributes: [],
              where: {
                thoi_gian_xuat: {
                  [Op.between]: [
                    `${formattedDate} 00:00:00`,
                    `${formattedDate} 23:59:59`,
                  ],
                },
              },
            },
          ],
          raw: true,
        });

        // Tính toán kết quả
        const chiphiValue = parseFloat(chiphi[0]?.chiphi || 0);
        const doanhthuValue = parseFloat(doanhthu[0]?.doanhthu || 0);
        const loiNhuan = doanhthuValue - chiphiValue;

        // Trả về kết quả cho ngày
        return {
          ngay: formattedDate,
          chiphi: chiphiValue,
          doanhthu: doanhthuValue,
          loi_nhuan: loiNhuan,
        };
      })
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Lỗi trong quá trình thống kê từ ngày đến ngày:", error);
      res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình thống kê." });
  }
}
module.exports = { 
  getThongKeKhachHang ,
  getThongKeProvider,
  getThongKeNhapXuat,
  getThongKeTheoNam,
  getThongKeTheoThang,
  getThongKeTheoNgay,
  getThongKe7NgayGanNhat,
  getThongKeNgayDenNgay
};
