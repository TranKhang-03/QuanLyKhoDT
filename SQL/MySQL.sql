-- --------------------------------------------------------
-- Máy chủ:                      127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Phiên bản:           12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for quanlikhohang
CREATE DATABASE IF NOT EXISTS `quanlikhohang` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `quanlikhohang`;

-- Dumping structure for table quanlikhohang.chi_tiet_phieu_nhap
CREATE TABLE IF NOT EXISTS `chi_tiet_phieu_nhap` (
  `ma_pn` int(11) NOT NULL,
  `ma_phien_ban_sp` int(11) DEFAULT NULL,
  `so_luong` int(11) NOT NULL,
  `gia_nhap` int(11) NOT NULL,
  KEY `ma_phien_ban_sp` (`ma_phien_ban_sp`),
  KEY `ma_phieu_nhap` (`ma_pn`) USING BTREE,
  CONSTRAINT `chi_tiet_phieu_nhap_ibfk_1` FOREIGN KEY (`ma_pn`) REFERENCES `phieu_nhap` (`ma_pn`),
  CONSTRAINT `chi_tiet_phieu_nhap_ibfk_2` FOREIGN KEY (`ma_phien_ban_sp`) REFERENCES `phien_ban_san_pham` (`ma_phien_ban_sp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.chi_tiet_phieu_nhap: ~31 rows (approximately)
INSERT INTO `chi_tiet_phieu_nhap` (`ma_pn`, `ma_phien_ban_sp`, `so_luong`, `gia_nhap`) VALUES
	(1, 1, 50, 10000000),
	(1, 2, 30, 10500000),
	(1, 3, 35, 12000000),
	(2, 4, 40, 12100000),
	(2, 5, 25, 12500000),
	(3, 6, 32, 12600000),
	(3, 7, 38, 12600000),
	(3, 8, 30, 11500000),
	(4, 9, 42, 11600000),
	(4, 10, 33, 12000000),
	(5, 11, 39, 12000000),
	(5, 12, 35, 12500000),
	(5, 13, 45, 12500000),
	(6, 14, 30, 13000000),
	(6, 15, 29, 13000000),
	(7, 16, 37, 6000000),
	(7, 17, 42, 6200000),
	(8, 18, 33, 6300000),
	(8, 19, 39, 6300000),
	(9, 20, 30, 4000000),
	(9, 21, 35, 4100000),
	(10, 22, 28, 4700000),
	(10, 23, 32, 4700000),
	(11, 24, 40, 6000000),
	(11, 25, 35, 6000000),
	(12, 26, 38, 6500000),
	(12, 27, 30, 6500000),
	(13, 28, 31, 13000000),
	(13, 29, 28, 13200000),
	(14, 30, 36, 13200000),
	(14, 31, 30, 14000000);

-- Dumping structure for table quanlikhohang.chi_tiet_phieu_xuat
CREATE TABLE IF NOT EXISTS `chi_tiet_phieu_xuat` (
  `ma_px` int(11) NOT NULL,
  `ma_phien_ban_sp` int(11) DEFAULT NULL,
  `so_luong` int(11) NOT NULL,
  `gia_xuat` int(11) NOT NULL,
  KEY `ma_phien_ban_sp` (`ma_phien_ban_sp`),
  KEY `ma_phieu_xuat` (`ma_px`) USING BTREE,
  CONSTRAINT `fk_chi_tiet_hd_ma_hd` FOREIGN KEY (`ma_px`) REFERENCES `phieu_xuat` (`ma_px`),
  CONSTRAINT `fk_chi_tiet_hd_ma_phien_ban_sp` FOREIGN KEY (`ma_phien_ban_sp`) REFERENCES `phien_ban_san_pham` (`ma_phien_ban_sp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.chi_tiet_phieu_xuat: ~36 rows (approximately)
INSERT INTO `chi_tiet_phieu_xuat` (`ma_px`, `ma_phien_ban_sp`, `so_luong`, `gia_xuat`) VALUES
	(1, 1, 25, 11000000),
	(1, 2, 15, 11500000),
	(1, 3, 12, 13000000),
	(2, 4, 17, 13100000),
	(2, 5, 10, 13500000),
	(2, 6, 18, 13700000),
	(3, 7, 10, 13700000),
	(3, 8, 8, 12000000),
	(3, 9, 5, 12100000),
	(4, 10, 12, 13000000),
	(4, 11, 15, 13000000),
	(4, 12, 18, 13000000),
	(5, 13, 10, 13000000),
	(5, 14, 8, 14000000),
	(5, 15, 20, 14000000),
	(6, 16, 17, 7000000),
	(6, 17, 25, 7100000),
	(6, 18, 18, 7300000),
	(7, 19, 30, 7300000),
	(7, 20, 10, 4500000),
	(7, 21, 15, 4600000),
	(8, 22, 22, 5200000),
	(8, 23, 18, 5200000),
	(8, 24, 10, 6500000),
	(9, 25, 15, 6500000),
	(9, 26, 13, 7000000),
	(9, 27, 18, 7000000),
	(10, 28, 16, 14000000),
	(10, 29, 12, 14200000),
	(10, 30, 11, 14200000),
	(11, 31, 27, 15000000),
	(11, 1, 10, 11000000),
	(11, 2, 13, 11500000),
	(12, 3, 15, 13000000),
	(12, 4, 8, 13100000),
	(12, 5, 20, 13500000);

-- Dumping structure for table quanlikhohang.chi_tiet_quyen
CREATE TABLE IF NOT EXISTS `chi_tiet_quyen` (
  `ma_quyen` int(11) DEFAULT NULL,
  `ma_chuc_nang` int(11) DEFAULT NULL,
  `hanh_dong` varchar(255) DEFAULT NULL,
  KEY `ma_chuc_nang` (`ma_chuc_nang`),
  KEY `ma_nhom_quyen` (`ma_quyen`) USING BTREE,
  CONSTRAINT `fk_chi_tiet_quyen_ma_chuc_nang` FOREIGN KEY (`ma_chuc_nang`) REFERENCES `chuc_nang` (`ma_chuc_nang`),
  CONSTRAINT `fk_chi_tiet_quyen_ma_quyen` FOREIGN KEY (`ma_quyen`) REFERENCES `nhom_quyen` (`ma_quyen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.chi_tiet_quyen: ~31 rows (approximately)
INSERT INTO `chi_tiet_quyen` (`ma_quyen`, `ma_chuc_nang`, `hanh_dong`) VALUES
	(1, 1, 'Thêm, sửa, xóa, xem'),
	(1, 2, 'Thêm, sửa, xóa, xem'),
	(1, 3, 'Thêm, sửa, xóa, xem'),
	(1, 4, 'Thêm, sửa, xóa, xem'),
	(1, 5, 'Thêm, sửa, xóa, xem'),
	(1, 6, 'Thêm, sửa, xóa, xem'),
	(1, 7, 'Thêm, sửa, xóa, xem'),
	(1, 8, 'Thêm, sửa, xóa, xem'),
	(1, 9, 'Thêm, sửa, xóa, xem'),
	(1, 10, 'Thêm, sửa, xóa, xem'),
	(1, 11, 'Thêm, sửa, xóa, xem'),
	(2, 1, 'Thêm, sửa, xóa, xem'),
	(2, 2, 'Thêm, sửa, xóa, xem'),
	(2, 3, 'Thêm, sửa, xóa, xem'),
	(2, 4, 'Thêm, sửa, xóa, xem'),
	(2, 5, 'Thêm, sửa, xóa, xem'),
	(2, 8, 'Thêm, sửa, xóa, xem'),
	(2, 9, 'Thêm, sửa, xóa, xem'),
	(2, 10, 'Thêm, sửa, xóa, xem'),
	(2, 11, 'Thêm, sửa, xóa, xem'),
	(3, 1, 'Thêm, sửa, xóa, xem'),
	(3, 2, 'Thêm, sửa, xóa, xem'),
	(3, 9, 'Thêm, sửa, xóa, xem'),
	(3, 10, 'Thêm, sửa, xóa, xem'),
	(3, 11, 'Thêm, sửa, xóa, xem'),
	(4, 1, 'xem'),
	(4, 2, 'xem'),
	(4, 8, 'xem'),
	(4, 9, 'xem'),
	(4, 10, 'xem'),
	(4, 11, 'xem');

-- Dumping structure for table quanlikhohang.chuc_nang
CREATE TABLE IF NOT EXISTS `chuc_nang` (
  `ma_chuc_nang` int(11) NOT NULL AUTO_INCREMENT,
  `ten_chuc_nang` varchar(255) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 1,
  PRIMARY KEY (`ma_chuc_nang`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.chuc_nang: ~11 rows (approximately)
INSERT INTO `chuc_nang` (`ma_chuc_nang`, `ten_chuc_nang`,`trang_thai`) VALUES
	(1, 'Quản lý sản phẩm',1),
	(2, 'Quản lý khu vực kho',1),
	(3, 'Quản lý nhân viên',1),
	(4, 'Quản lý khách hàng',1),
	(5, 'Quản lý nhà cung cấp',1),
	(6, 'Quản lý tài khoản',1),
	(7, 'Quản lý nhóm quyền',1),
	(8, 'Quản lý thống kê',1),
	(9, 'Quản lý nhập hàng',1),
	(10, 'Quản lý xuất hàng',1),
	(11, 'Quản lý thuộc tính',1);

-- Dumping structure for table quanlikhohang.he_dieu_hanh
CREATE TABLE IF NOT EXISTS `he_dieu_hanh` (
  `ma_hdh` int(11) NOT NULL AUTO_INCREMENT,
  `ten_hdh` varchar(255) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 1,
  PRIMARY KEY (`ma_hdh`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.he_dieu_hanh: ~2 rows (approximately)
INSERT INTO `he_dieu_hanh` (`ma_hdh`, `ten_hdh`,`trang_thai`) VALUES
	(1, 'Android',1),
	(2, 'iOS',1);

-- Dumping structure for table quanlikhohang.khach_hang
CREATE TABLE IF NOT EXISTS `khach_hang` (
  `ma_kh` int(11) NOT NULL AUTO_INCREMENT,
  `ten_kh` varchar(255) DEFAULT NULL,
  `dia_chi_kh` varchar(255) DEFAULT NULL,
  `sdt_kh` varchar(12) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 1,
  PRIMARY KEY (`ma_kh`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.khach_hang: ~8 rows (approximately)
INSERT INTO `khach_hang` (`ma_kh`, `ten_kh`, `dia_chi_kh`, `sdt_kh`, `trang_thai`) VALUES
	(1, 'Nguyễn Văn A', 'Gia Đức, Ân Đức, Hoài Ân, Bình Định', '0387913347', 1),
	(2, 'Trần Nhất Nhất', '205 Trần Hưng Đạo, Phường 10, Quận 5, Thành phố Hồ Chí Minh', '0123456789', 1),
	(3, 'Hoàng Gia Bo', 'Khoa Trường, Hoài Ân, Bình Định', '0987654321', 1),
	(4, 'Nguyễn Thị Minh Anh', '123 Phố Huế, Quận Hai Bà Trưng, Hà Nội', '0935123456', 1),
	(5, 'Trần Đức Minh', '789 Đường Lê Hồng Phong, Thành phố Đà Nẵng', '0983456789', 1),
	(6, 'Phạm Thanh Hằng', '102 Lê Duẩn, Thành phố Hải Phòng', '0965876543', 1),
	(7, 'Hoàng Đức Anh', '321 Lý Thường Kiệt, Thành phố Cần Thơ', '0946789012', 1);

-- Dumping structure for table quanlikhohang.khu_vuc_kho
CREATE TABLE IF NOT EXISTS `khu_vuc_kho` (
  `ma_kho` int(11) NOT NULL AUTO_INCREMENT,
  `ten_kho` varchar(255) DEFAULT NULL,
  `chu_thich` varchar(255) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL,
  PRIMARY KEY (`ma_kho`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.khu_vuc_kho: ~11 rows (approximately)
INSERT INTO `khu_vuc_kho` (`ma_kho`, `ten_kho`, `chu_thich`, `trang_thai`) VALUES
	(1, 'Kho A', 'kho Apple aaa', 1),
	(2, 'Kho B2', 'kho Samsung', 1),
	(3, 'Kho C', 'kho Oppo', 1),
	(4, 'Kho D', 'kho Xiaomi', 1),
	(5, 'Kho E', 'kho Sony', 1),
	(6, 'Kho F', 'kho Huawei', 1),
	(7, 'Kho G', 'kho Google', 1),
	(8, 'Kho H', 'kho Asus', 1),
	(9, 'Kho Ine', 'kho Nokia', 1),
	(10, 'Kho K', 'kho Realme', 1),
	(11, 'Kho M', 'kho Poco', 1);

-- Dumping structure for table quanlikhohang.mau_sac
CREATE TABLE IF NOT EXISTS `mau_sac` (
  `ma_mau` int(11) NOT NULL AUTO_INCREMENT,
  `ten_mau` varchar(30) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 1,
  PRIMARY KEY (`ma_mau`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.mau_sac: ~3 rows (approximately)
INSERT INTO `mau_sac` (`ma_mau`, `ten_mau`,`trang_thai`) VALUES
	(1, 'Đen',1),
	(2, 'Trắng',1),
	(3, 'Xanh Dương',1);

-- Dumping structure for table quanlikhohang.nhan_vien
CREATE TABLE IF NOT EXISTS `nhan_vien` (
  `ma_nv` varchar(255) NOT NULL,
  `ten_nv` varchar(255) DEFAULT NULL,
  `gioi_tinh` varchar(5) DEFAULT NULL,
  `sdt` varchar(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mat_khau` varchar(255) DEFAULT NULL,
  `ma_quyen` int(11) NOT NULL,
  `trang_thai` int(1) DEFAULT NULL,
  PRIMARY KEY (`ma_nv`),
  KEY `fk_quyen` (`ma_quyen`),
  CONSTRAINT `nhan_vien_ibfk_1` FOREIGN KEY (`ma_quyen`) REFERENCES `nhom_quyen` (`ma_quyen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table quanlikhohang.nhan_vien: ~5 rows (approximately)
INSERT INTO `nhan_vien` (`ma_nv`, `ten_nv`, `gioi_tinh`, `sdt`, `email`, `mat_khau`, `ma_quyen`, `trang_thai`) VALUES
	('admin', 'Admin', 'NULL', 'NULL', 'admin@gmail.com', 'admin', 1, 1),
	('nv1', 'Lê Thị C', 'Nữ', '0966778899', 'lethic@example.com', 'password123', 2, 1),
	('nv2', 'Nguyễn Văn E', 'Nam', '0911223344', 'nguyenvane@example.com', 'password123', 3, 1),
	('nv3', 'Ngô Thị F', 'Nữ', '0966778899', 'ngothif@example.com', 'password123', 4, 1),
	('nv4', 'Hoàng Xuân G', 'Nam', '0911223344', 'hoangxuang@example.com', 'password123', 3, 1);

-- Dumping structure for table quanlikhohang.nha_cung_cap
CREATE TABLE IF NOT EXISTS `nha_cung_cap` (
  `ma_ncc` int(11) NOT NULL AUTO_INCREMENT,
  `ten_ncc` varchar(255) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `email_ncc` varchar(255) DEFAULT NULL,
  `sdt_ncc` varchar(11) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 1,
  PRIMARY KEY (`ma_ncc`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.nha_cung_cap: ~12 rows (approximately)
INSERT INTO `nha_cung_cap` (`ma_ncc`, `ten_ncc`, `dia_chi`, `email_ncc`, `sdt_ncc`, `trang_thai`) VALUES
	(1, 'Công ty Apple', 'Mỹ', 'contact@apple.com', '0987654321', 1),
	(2, 'Samsung Việt Nam', 'Hà Nội', 'contact@samsung.vn', '0123456789', 1),
	(3, 'Công ty Oppo', '27 Đ. Nguyễn Trung Trực, Phường Bến Thành, Quận 1, Thành phố Hồ Chí Minh', 'oppovietnam@oppo.vn', '0456345234', 1),
	(4, 'Công ty Xiaomi', 'Trung Quốc', 'contact@xiaomi.com', '0956281536', 1),
	(5, 'Công ty Sony', 'Trung Quốc', 'contact@sony.com', '0877744422', 1),
	(6, 'Công ty Huawei', 'Trung Quốc', 'contact@huawei.com', '0956242544', 1),
	(7, 'Công ty Google', 'Mỹ', 'contact@google.com', '0233462128', 1),
	(8, 'Công ty Asus', 'Đài Loan', 'contact@asus.com', '0956666111', 1),
	(9, 'Công ty Nokia', 'Phòng 703, Tầng7, Tòa Nhà Metropolitan, 235 Đồng Khởi, P. Bến Nghé, Q. 1, Tp. Hồ Chí Minh (TPHCM)', 'chau.nguyen@nokia.com', '02838236894', 1),
	(10, 'Công ty Realme', 'Trung Quốc', 'contact@realme.com', '0111222333', 1),
	(11, 'Công ty Poco', 'Trung Quốc', 'contact@poco.com', '0112567211', 1);

-- Dumping structure for table quanlikhohang.nhom_quyen
CREATE TABLE IF NOT EXISTS `nhom_quyen` (
  `ma_quyen` int(11) NOT NULL AUTO_INCREMENT,
  `ten_quyen` varchar(255) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT 1,
  PRIMARY KEY (`ma_quyen`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.nhom_quyen: ~4 rows (approximately)
INSERT INTO `nhom_quyen` (`ma_quyen`, `ten_quyen`,`trang_thai`) VALUES
	(1, 'Admin',1),
	(2, 'Quản lý',1),
	(3, 'Nhân viên kho',1),
	(4, 'Nhân viên kiểm toán',1);

-- Dumping structure for table quanlikhohang.phien_ban_san_pham
CREATE TABLE IF NOT EXISTS `phien_ban_san_pham` (
  `ma_phien_ban_sp` int(11) NOT NULL AUTO_INCREMENT,
  `ma_sp` int(11) NOT NULL,
  `ma_ram` int(11) DEFAULT NULL,
  `ma_rom` int(11) DEFAULT NULL,
  `ma_mau` int(11) DEFAULT NULL,
  `gia_nhap` int(11) DEFAULT NULL,
  `gia_xuat` int(11) DEFAULT NULL,
  `ton_kho` int(11) DEFAULT 0,
  `trang_thai` int(1) DEFAULT 1,
  PRIMARY KEY (`ma_phien_ban_sp`),
  KEY `ma_ram` (`ma_ram`),
  KEY `ma_rom` (`ma_rom`),
  KEY `ma_mau` (`ma_mau`),
  KEY `ma_san_pham` (`ma_sp`) USING BTREE,
  CONSTRAINT `phien_ban_san_pham_ibfk_1` FOREIGN KEY (`ma_sp`) REFERENCES `san_pham` (`ma_sp`),
  CONSTRAINT `phien_ban_san_pham_ibfk_2` FOREIGN KEY (`ma_ram`) REFERENCES `ram` (`ma_ram`),
  CONSTRAINT `phien_ban_san_pham_ibfk_3` FOREIGN KEY (`ma_rom`) REFERENCES `rom` (`ma_rom`),
  CONSTRAINT `phien_ban_san_pham_ibfk_4` FOREIGN KEY (`ma_mau`) REFERENCES `mau_sac` (`ma_mau`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.phien_ban_san_pham: ~74 rows (approximately)
INSERT INTO `phien_ban_san_pham` (`ma_phien_ban_sp`, `ma_sp`, `ma_ram`, `ma_rom`, `ma_mau`, `gia_nhap`, `gia_xuat`, `ton_kho`,`trang_thai`) VALUES
	(1, 1, 2, 2, 1, 10000000, 11000000, 10,1),
	(2, 1, 2, 2, 2, 10500000, 11500000, 10,1),
	(3, 1, 3, 3, 1, 12000000, 13000000, 15,1),
	(4, 1, 3, 3, 2, 12100000, 13100000, 10,1),
	(5, 1, 3, 4, 1, 12500000, 13500000, 8,1),
	(6, 1, 3, 4, 2, 12600000, 13700000, 12,1),
	(7, 1, 3, 4, 3, 12600000, 13700000, 10,1),
	(8, 2, 2, 2, 1, 11500000, 12000000, 15,1),
	(9, 2, 2, 2, 3, 11600000, 12100000, 13,1),
	(10, 2, 3, 2, 1, 12000000, 13000000, 20,1),
	(11, 2, 3, 2, 3, 12000000, 13000000, 16,1),
	(12, 2, 3, 3, 1, 12500000, 13000000, 15,1),
	(13, 2, 3, 3, 3, 12500000, 13000000, 18,1),
	(14, 2, 3, 4, 1, 13000000, 14000000, 7,1),
	(15, 2, 3, 4, 3, 13000000, 14000000, 13,1),
	(16, 3, 1, 2, 1, 6000000, 7000000, 30,1),
	(17, 3, 1, 2, 3, 6200000, 7100000, 20,1),
	(18, 3, 2, 3, 1, 6300000, 7300000, 12,1),
	(19, 3, 2, 3, 3, 6300000, 7300000, 15,1),
	(20, 4, 1, 2, 2, 4000000, 4500000, 21,1),
	(21, 4, 1, 2, 3, 4100000, 4600000, 18,1),
	(22, 4, 2, 3, 2, 4700000, 5200000, 11,1),
	(23, 4, 2, 3, 3, 4700000, 5200000, 6,1),
	(24, 5, 2, 2, 1, 6000000, 6500000, 14,1),
	(25, 5, 2, 2, 3, 6000000, 6500000, 12,1),
	(26, 5, 2, 3, 1, 6500000, 7000000, 18,1),
	(27, 5, 2, 3, 3, 6500000, 7000000, 11,1),
	(28, 6, 2, 2, 1, 13000000, 14000000, 11,1),
	(29, 6, 2, 2, 2, 13200000, 14200000, 13,1),
	(30, 6, 2, 2, 3, 13200000, 14200000, 13,1),
	(31, 6, 3, 3, 1, 14000000, 15000000, 12,1),
	(32, 6, 3, 3, 2, 14200000, 15200000, 16,1),
	(33, 6, 3, 3, 3, 14200000, 15200000, 11,1),
	(34, 6, 3, 4, 1, 15000000, 15000000, 9,1),
	(35, 6, 3, 4, 2, 15100000, 16100000, 6,1),
	(36, 6, 3, 4, 3, 15100000, 16100000, 8,1),
	(37, 7, 2, 2, 2, 10000000, 11000000, 10,1),
	(38, 7, 2, 3, 3, 10200000, 112000000, 7,1),
	(39, 7, 3, 2, 2, 11000000, 120000000, 15,1),
	(40, 7, 3, 3, 3, 11200000, 122000000, 11,1),
	(41, 8, 2, 2, 1, 13000000, 14000000, 19,1),
	(42, 8, 2, 3, 1, 14500000, 15000000, 9,1),
	(43, 9, 3, 3, 1, 17000000, 18000000, 15,1),
	(44, 9, 3, 4, 1, 17500000, 18500000, 5,1),
	(45, 9, 2, 2, 1, 15000000, 16000000, 13,1),
	(46, 10, 2, 2, 1, 6000000, 6500000, 10,1),
	(47, 10, 2, 2, 2, 6100000, 6600000, 8,1),
	(48, 10, 2, 2, 3, 6100000, 6600000, 11,1),
	(49, 11, 2, 2, 1, 4000000, 4500000, 18,1),
	(50, 11, 2, 2, 2, 4100000, 4600000, 16,1),
	(51, 12, 2, 2, 1, 9000000, 10000000, 10,1),
	(52, 12, 2, 2, 2, 9500000, 10500000, 10,1),
	(53, 12, 3, 3, 1, 10000000, 11000000, 15,1),
	(54, 12, 3, 3, 2, 10100000, 11100000, 10,1),
	(55, 12, 3, 4, 1, 11500000, 12500000, 8,1),
	(56, 12, 3, 4, 2, 11600000, 12600000, 12,1),
	(57, 12, 3, 4, 3, 11600000, 12600000, 10,1),
	(58, 13, 2, 2, 1, 20000000, 21000000, 12,1),
	(59, 13, 2, 2, 2, 20100000, 21100000, 10,1),
	(60, 13, 3, 2, 1, 21000000, 22000000, 20,1),
	(61, 13, 3, 2, 2, 21100000, 22100000, 15,1),
	(62, 13, 3, 3, 1, 21500000, 22500000, 8,1),
	(63, 13, 3, 3, 2, 21600000, 22600000, 9,1),
	(64, 13, 3, 4, 1, 22000000, 22700000, 34,1),
	(65, 13, 3, 4, 2, 22100000, 22800000, 17,1),
	(66, 14, 2, 2, 1, 7000000, 7500000, 17,1),
	(67, 14, 2, 2, 3, 7100000, 7600000, 11,1),
	(68, 14, 2, 3, 1, 7400000, 7900000, 20,1),
	(69, 14, 2, 3, 3, 7500000, 8000000, 7,1),
	(70, 15, 2, 2, 1, 5000000, 5500000, 30,1),
	(71, 15, 2, 2, 3, 5100000, 5600000, 18,1),
	(72, 15, 2, 3, 1, 5300000, 5700000, 22,1),
	(73, 15, 2, 3, 3, 5400000, 5800000, 14,1);

-- Dumping structure for table quanlikhohang.phieu_nhap
CREATE TABLE IF NOT EXISTS `phieu_nhap` (
  `ma_pn` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nv` varchar(255) DEFAULT NULL,
  `ma_ncc` int(11) DEFAULT NULL,
  `thoi_gian_nhap` datetime DEFAULT current_timestamp(),
  `tong_tien` int(11) NOT NULL DEFAULT 0,
  `trang_thai` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`ma_pn`) USING BTREE,
  KEY `ten_tk` (`ma_nv`) USING BTREE,
  KEY `ma_nha_cung_cap` (`ma_ncc`) USING BTREE,
  CONSTRAINT `fk_phieu_nhap_ma_ncc` FOREIGN KEY (`ma_ncc`) REFERENCES `nha_cung_cap` (`ma_ncc`),
  CONSTRAINT `fk_phieu_nhap_ma_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table quanlikhohang.phieu_nhap: ~14 rows (approximately)
INSERT INTO `phieu_nhap` (`ma_pn`, `ma_nv`, `ma_ncc`, `thoi_gian_nhap`, `tong_tien`, `trang_thai`) VALUES
	(1, 'nv2', 1, '2023-01-15 08:45:00', 1235000000, 1),
	(2, 'nv2', 3, '2023-03-10 10:15:00', 796500000, 1),
	(3, 'nv4', 2, '2023-05-20 09:30:00', 1227000000, 1),
	(4, 'nv4', 4, '2023-07-08 14:20:00', 883200000, 1),
	(5, 'nv4', 5, '2023-08-17 13:55:00', 1468000000, 1),
	(6, 'nv2', 6, '2023-09-28 11:25:00', 767000000, 1),
	(7, 'nv2', 7, '2023-11-30 16:40:00', 482400000, 1),
	(8, 'nv2', 8, '2024-01-25 10:10:00', 453600000, 1),
	(9, 'nv2', 9, '2024-03-14 08:50:00', 263500000, 1),
	(10, 'nv4', 10, '2024-05-20 15:35:00', 282000000, 1),
	(11, 'nv4', 3, '2024-07-05 14:00:00', 450000000, 1),
	(12, 'nv2', 2, '2024-08-28 13:10:00', 442000000, 1),
	(13, 'nv2', 4, '2024-09-15 12:50:00', 772600000, 1),
	(14, 'nv4', 1, '2024-10-05 09:30:00', 895200000, 1);

-- Dumping structure for table quanlikhohang.phieu_xuat
CREATE TABLE IF NOT EXISTS `phieu_xuat` (
  `ma_px` int(11) NOT NULL AUTO_INCREMENT,
  `ma_nv` varchar(255) DEFAULT NULL,
  `ma_kh` int(11) DEFAULT NULL,
  `thoi_gian_xuat` datetime DEFAULT current_timestamp(),
  `tong_tien` int(13) DEFAULT NULL,
  `trang_thai` int(11) DEFAULT NULL,
  PRIMARY KEY (`ma_px`) USING BTREE,
  KEY `ten_tk` (`ma_nv`) USING BTREE,
  KEY `ma_khach_hang` (`ma_kh`) USING BTREE,
  CONSTRAINT `fk_hoa_don_ma_kh` FOREIGN KEY (`ma_kh`) REFERENCES `khach_hang` (`ma_kh`),
  CONSTRAINT `fk_hoa_don_ma_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- Dumping data for table quanlikhohang.phieu_xuat: ~12 rows (approximately)
INSERT INTO `phieu_xuat` (`ma_px`, `ma_nv`, `ma_kh`, `thoi_gian_xuat`, `tong_tien`, `trang_thai`) VALUES
	(1, 'nv2', 1, '2023-02-10 14:30:00', 603500000, 1),
	(2, 'nv2', 3, '2023-04-01 15:20:00', 604300000, 1),
	(3, 'nv2', 5, '2023-06-12 13:15:00', 293500000, 1),
	(4, 'nv2', 6, '2023-08-25 17:30:00', 585000000, 1),
	(5, 'nv4', 3, '2023-10-19 10:10:00', 522000000, 1),
	(6, 'nv4', 4, '2023-12-01 14:00:00', 427900000, 1),
	(7, 'nv2', 2, '2024-02-05 11:45:00', 333000000, 1),
	(8, 'nv4', 5, '2024-03-18 13:25:00', 273000000, 1),
	(9, 'nv2', 2, '2024-05-11 16:35:00', 314500000, 1),
	(10, 'nv4', 4, '2024-07-23 15:55:00', 550600000, 1),
	(11, 'nv4', 5, '2024-09-02 09:45:00', 664500000, 1),
	(12, 'nv2', 6, '2024-10-09 11:20:00', 569800000, 1);

-- Dumping structure for table quanlikhohang.ram
CREATE TABLE IF NOT EXISTS `ram` (
  `ma_ram` int(11) NOT NULL AUTO_INCREMENT,
  `kich_thuoc_ram` int(11) DEFAULT NULL,
  `trang_thai` int(1) DEFAULT 1,
  PRIMARY KEY (`ma_ram`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.ram: ~3 rows (approximately)
INSERT INTO `ram` (`ma_ram`, `kich_thuoc_ram`,`trang_thai`) VALUES
	(1, 4,1),
	(2, 8,1),
	(3, 16,1);

-- Dumping structure for table quanlikhohang.rom
CREATE TABLE IF NOT EXISTS `rom` (
  `ma_rom` int(11) NOT NULL AUTO_INCREMENT,
  `kich_thuoc_rom` int(11) DEFAULT NULL,
  `trang_thai` int(1) DEFAULT 1,
  PRIMARY KEY (`ma_rom`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.rom: ~4 rows (approximately)
INSERT INTO `rom` (`ma_rom`, `kich_thuoc_rom`,`trang_thai`) VALUES
	(1, 64,1),
	(2, 128,1),
	(3, 256,1),
	(4, 512,1);

-- Dumping structure for table quanlikhohang.san_pham
CREATE TABLE IF NOT EXISTS `san_pham` (
  `ma_sp` int(11) NOT NULL AUTO_INCREMENT,
  `ten_sp` varchar(255) DEFAULT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `chip_xu_ly` varchar(255) DEFAULT NULL,
  `dung_luong_pin` int(11) DEFAULT NULL,
  `kich_thuoc_man` float DEFAULT NULL,
  `camera_truoc` varchar(255) DEFAULT NULL,
  `camera_sau` varchar(255) DEFAULT NULL,
  `hdh` int(11) DEFAULT NULL,
  `thuong_hieu` int(11) DEFAULT NULL,
  `xuat_xu` int(11) DEFAULT NULL,
  `khu_vuc_kho` int(11) DEFAULT NULL,
  `so_luong_ton` int(11) DEFAULT NULL,
  `mo_ta_sp` varchar(255) DEFAULT NULL,
  `trang_thai` int(1) DEFAULT 1,
  PRIMARY KEY (`ma_sp`),
  KEY `thuong_hieu` (`thuong_hieu`),
  KEY `xuat_xu` (`xuat_xu`),
  KEY `fk_hdh` (`hdh`) USING BTREE,
  KEY `FK4_khu_vuc_kho` (`khu_vuc_kho`),
  CONSTRAINT `FK1_hdh` FOREIGN KEY (`hdh`) REFERENCES `he_dieu_hanh` (`ma_hdh`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK2_thuong_hieu` FOREIGN KEY (`thuong_hieu`) REFERENCES `thuong_hieu` (`ma_thuong_hieu`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK3_xuat_xu` FOREIGN KEY (`xuat_xu`) REFERENCES `xuat_xu` (`ma_xuat_xu`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK4_khu_vuc_kho` FOREIGN KEY (`khu_vuc_kho`) REFERENCES `khu_vuc_kho` (`ma_kho`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.san_pham: ~15 rows (approximately)
INSERT INTO `san_pham` (`ma_sp`, `ten_sp`, `hinh_anh`, `chip_xu_ly`, `dung_luong_pin`, `kich_thuoc_man`, `camera_truoc`, `camera_sau`, `hdh`, `thuong_hieu`, `xuat_xu`, `khu_vuc_kho`, `so_luong_ton`, `mo_ta_sp`,`trang_thai`) VALUES
	(1, 'iPhone 12', 'Iphone12', 'A14 Bionic', 2815, 6.1, '12 MP', '12 MP + 12 MP', 1, 1, 3, 1, 75, 'Smartphone cao cấp từ Apple',1),
	(2, 'Samsung Galaxy S21', 'SamSungGalaxyS21', 'Exynos 2100', 4000, 6.2, '10 MP', '12 MP + 64 MP', 2, 2, 1, 2, 117, 'Smartphone cao cấp từ Samsung',1),
	(3, 'Oppo Find X3', 'OppoFindX3', 'Snapdragon 870', 4500, 6.7, '32 MP', '50 MP + 50 MP', 1, 3, 1, 3, 77, 'Smartphone của Oppo',1),
	(4, 'Xiaomi Mi 11', 'XiaomiMi11', 'Snapdragon 888', 4600, 6.8, '20 MP', '108 MP + 13 MP', 1, 4, 2, 4, 56, 'Smartphone từ Xiaomi',1),
	(5, 'Vivo X60 Pro', 'VivoX60Pro', 'Exynos 1080', 4200, 6.6, '32 MP', '48 MP + 13 MP', 2, 3, 1, 3, 55, 'Smartphone của Vivo',1),
	(6, 'Sony Xperia 1 III', 'SonyXperia1III', 'Snapdragon 888', 4500, 6.5, '8 MP', '12 MP + 12 MP + 12 MP', 1, 5, 2, 5, 99, 'Smartphone của Sony',1),
	(7, 'Huawei P50 Pro', 'HuaweiP50Pro', 'Kirin 9000', 4360, 6.6, '13 MP', '50 MP + 40 MP', 2, 6, 2, 6, 43, 'Smartphone của Huawei',1),
	(8, 'Google Pixel 6', 'GooglePixel6', 'Tensor', 4614, 6.4, '8 MP', '50 MP + 12 MP', 1, 7, 3, 7, 28, 'Smartphone của Google',1),
	(9, 'Asus ROG Phone 5', 'AsusROGPhone5', 'Snapdragon 888', 6000, 6.78, '24 MP', '64 MP + 13 MP', 1, 8, 4, 8, 33, 'Smartphone chơi game của Asus',1),
	(10, 'Nokia X20', 'NokiaX20', 'Snapdragon 480', 4470, 6.67, '32 MP', '48 MP + 5 MP', 1, 9, 1, 9, 29, 'Smartphone của Nokia',1),
	(11, 'Realme GT', 'RealmeGT', 'Snapdragon 888', 4500, 6.43, '16 MP', '64 MP + 8 MP', 2, 10, 2, 10, 34, 'Smartphone của Realme',1),
	(12, ' iPhone 13', 'iPhone13', 'A15 Bionic', 3095, 6.1, '12 MP', '12 MP + 12 MP', 1, 1, 3, 1, 75, 'Smartphone cao cấp mới của Apple',1),
	(13, 'Samsung Galaxy Z Fold 3', 'SamsungGalaxyZFold3', 'Snapdragon 888', 4400, 7.6, '10 MP', '12 MP + 12 MP', 1, 2, 1, 3, 125, 'Điện thoại gập từ Samsung',1),
	(14, 'Poco F3', 'PocoF3', 'Snapdragon 870', 4520, 6.67, '20 MP', '48 MP + 8 MP', 2, 11, 2, 11, 55, 'Smartphone giá rẻ từ Poco',1),
	(15, 'Redmi Note 10 Pro', 'RedmiNote10Pro', 'Snapdragon 732G', 5020, 6.67, '16 MP', '108 MP + 8 MP', 1, 4, 2, 4, 84, 'Smartphone tầm trung của Xiaomi',1);

-- Dumping structure for table quanlikhohang.thuong_hieu
CREATE TABLE IF NOT EXISTS `thuong_hieu` (
  `ma_thuong_hieu` int(11) NOT NULL AUTO_INCREMENT,
  `ten_thuong_hieu` varchar(255) DEFAULT NULL,
  `trang_thai` int(1) DEFAULT 1,
  PRIMARY KEY (`ma_thuong_hieu`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.thuong_hieu: ~11 rows (approximately)
INSERT INTO `thuong_hieu` (`ma_thuong_hieu`, `ten_thuong_hieu`,`trang_thai`) VALUES
	(1, 'Apple',1),
	(2, 'Samsung',1),
	(3, 'Oppo',1),
	(4, 'Xiaomi',1),
	(5, 'Sony',1),
	(6, 'Huawei',1),
	(7, 'Google',1),
	(8, 'Asus',1),
	(9, 'Nokia',1),
	(10, 'Realme',1),
	(11, 'Poco',1);

-- Dumping structure for table quanlikhohang.xuat_xu
CREATE TABLE IF NOT EXISTS `xuat_xu` (
  `ma_xuat_xu` int(11) NOT NULL AUTO_INCREMENT,
  `ten_xuat_xu` varchar(255) DEFAULT NULL,
  `trang_thai` int(1) DEFAULT 1,
  PRIMARY KEY (`ma_xuat_xu`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table quanlikhohang.xuat_xu: ~4 rows (approximately)
INSERT INTO `xuat_xu` (`ma_xuat_xu`, `ten_xuat_xu`,`trang_thai`) VALUES
	(1, 'Việt Nam',1),
	(2, 'Trung Quốc',1),
	(3, 'Mỹ',1),
	(4, 'Đài Loan',1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;