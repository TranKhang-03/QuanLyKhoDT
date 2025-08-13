import React, { useState, useEffect } from "react";
import "../Product/detailProduct.css";

const DetailProductModal = ({ show, onClose, product }) => {
  const [showTable, setShowTable] = useState(false); // State để hiển thị bảng
  const [showDetail, setShowDetail] = useState(true); // State để điều khiển hiển thị chi tiết sản phẩm
  const [selectedColor, setSelectedColor] = useState("");
  const colorMap = {
    "Xanh Dương": "#27A4F2",
    Đỏ: "#FF0000",
    Vàng: "#FFFF00",
    "Xanh lá": "#008000",
    Đen: "#000000",
    Trắng: "#FFFFFF",
  };
  const availableColors = [
    ...new Set(
      product?.phienBanSanPhams?.map((item) => item.mauSac?.ten_mau) || []
    ),
  ];
  useEffect(() => {
    if (product && availableColors.length > 0) {
      setSelectedColor(availableColors[0]); // Đặt màu đầu tiên mặc định
    }
  }, [product]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleContinue = () => {
    setShowDetail(false); // Ẩn phần chi tiết sản phẩm khi bấm "Tiếp Tục"
    setShowTable(true); // Hiển thị bảng khi bấm "Tiếp Tục"
  };

  const handleGoBack = () => {
    setShowDetail(true); // Hiển thị lại phần chi tiết sản phẩm khi bấm "Quay trở lại"
    setShowTable(false); // Ẩn bảng khi bấm "Quay trở lại"
  };

  if (!show || !product) return null;
  const imageURL = product?.hinh_anh
    ? `/img/${product.hinh_anh}_${selectedColor}.jpg`
    : "not image";
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close" onClick={onClose}>
          X
        </button>
        <h2>Chi tiết sản phẩm</h2>
        <h3>{product.ten_sp || "Tên sản phẩm chưa cập nhật"}</h3>

        {/* Phần chi tiết sản phẩm */}
        {showDetail && (
          <div className="detail-content">
            <div className="detail-left">
              <div className="img-detail">
                <img src={imageURL} alt={product?.ten_sp} />
              </div>
              <div className="color-option">
                {availableColors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-button ${
                      selectedColor === color ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: colorMap[color] || "#ccc", // Màu nền theo tên màu
                      border:
                        selectedColor === color
                          ? "2px solid black"
                          : "1px solid #ccc",
                    }}
                    onClick={() => handleColorChange(color)}
                  ></button>
                ))}
              </div>
            </div>
            <div className="detail-right">
              <p>
                <strong>Chip xử lý:</strong> {product.chip_xu_ly}
              </p>
              <p>
                <strong>Dung lượng pin:</strong>{" "}
                {product.dung_luong_pin
                  ? `${product.dung_luong_pin} mAh`
                  : "Không có thông tin"}
              </p>
              <p>
                <strong>Kích thước màn hình:</strong>{" "}
                {product.kich_thuoc_man
                  ? `${product.kich_thuoc_man} inch`
                  : "Không có thông tin"}
              </p>
              <p>
                <strong>Camera trước:</strong> {product.camera_truoc}
              </p>
              <p>
                <strong>Camera sau:</strong> {product.camera_sau}
              </p>
              <p>
                <strong>Hệ điều hành:</strong>{" "}
                {product.operatingSystem?.ten_hdh}
              </p>
              <p>
                <strong>Thương hiệu:</strong> {product.brand?.ten_thuong_hieu}
              </p>
              <p>
                <strong>Xuất xứ:</strong> {product.origin?.ten_xuat_xu}
              </p>
              <p>
                <strong>Khu vực:</strong> {product.storageArea?.ten_kho}
              </p>
              <p>
                <strong>Số lượng tồn:</strong> {product.so_luong_ton}
              </p>
              <button className="next-tab" onClick={handleContinue}>
                Tiếp Tục
              </button>
            </div>
          </div>
        )}

        {/* Bảng hiển thị khi nhấn "Tiếp Tục" */}
        {showTable && product.phienBanSanPhams && (
          <div className="product-table">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>RAM</th>
                  <th>ROM</th>
                  <th>Màu sắc</th>
                  <th>Giá nhập</th>
                  <th>Giá xuất</th>
                </tr>
              </thead>
              <tbody>
                {product.phienBanSanPhams.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.ram?.kich_thuoc_ram || "Không có thông tin"}</td>
                    <td>{item.rom?.kich_thuoc_rom || "Không có thông tin"}</td>
                    <td>{item.mauSac?.ten_mau || "Không có thông tin"}</td>
                    <td>{item.gia_nhap || "Không có thông tin"}</td>
                    <td>{item.gia_xuat || "Không có thông tin"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="comback" onClick={handleGoBack}>
              Quay trở lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DetailProductModal;
