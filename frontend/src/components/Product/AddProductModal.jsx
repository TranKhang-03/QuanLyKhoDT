import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Product/style.css"; // Đường dẫn tới file CSS
import "../Product/next-tab.css";

const AddProductModal = ({ show, onClose }) => {
  const [errors, setErrors] = useState({});
  const [isNextTabVisible, setIsNextTabVisible] = useState(false); // Quản lý trạng thái hiển thị tab tiếp theo
  const [brands, setBrands] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [os, setOs] = useState([]);
  const [area, setArea] = useState([]);
  const [colors, setColors] = useState([]);
  const [ram, setRam] = useState([]);
  const [rom, setRom] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  //
  const [configurations, setConfigurations] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Để lưu index của cấu hình đang sửa
  const [formData, setFormData] = useState({
    productName: "",
    chip: "",
    battery: "",
    screenSize: "",
    frontCamera: "",
    rearCamera: "",
    os: "",
    brand: "",
    origin: "",
    region: "",
  });
  const [newConfig, setNewConfig] = useState({
    rom: "",
    ram: "",
    color: "",
    priceImport: "",
    priceSell: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandResponse = await axios.get(
          "http://localhost:5000/api/brands"
        );
        const originResponse = await axios.get(
          "http://localhost:5000/api/origins"
        );
        const osResponse = await axios.get("http://localhost:5000/api/os");
        const areaReponse = await axios.get(
          "http://localhost:5000/api/warehouses"
        );
        const colorReponse = await axios.get("http://localhost:5000/api/color");
        const ramReponse = await axios.get("http://localhost:5000/api/ram");
        const romReponse = await axios.get("http://localhost:5000/api/rom");

        setBrands(brandResponse.data);
        setOrigins(originResponse.data);
        setOs(osResponse.data);
        setArea(areaReponse.data);
        setColors(colorReponse.data);
        setRam(ramReponse.data);
        setRom(romReponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  if (!show) return null;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" }); // Xóa lỗi khi người dùng nhập
  };
  const handleInputChange_nextTab = (e) => {
    const { id, value } = e.target;
    setNewConfig((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateProductForm = () => {
    const newErrors = {};
    if (!selectedImage || selectedImage.length === 0) {
      alert("Không để trống ảnh");
      return;
    }
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Không được để trống";
      }
    });
    setErrors(newErrors);
    // Tìm tất cả các ô còn lỗi và focus vào chúng
    Object.keys(newErrors).forEach((key) => {
      const errorField = document.getElementById(key);
      if (errorField) errorField.focus();
    });
    return Object.keys(newErrors).length === 0;
  };
  const validateConfigForm = () => {
    const priceImport = Number(newConfig.priceImport);
    const priceSell = Number(newConfig.priceSell);

    // Kiểm tra các trường bắt buộc không được để trống
    if (
      !newConfig.rom ||
      !newConfig.ram ||
      !newConfig.color ||
      isNaN(priceImport) || // Kiểm tra nếu không phải số
      isNaN(priceSell)
    ) {
      alert("Vui lòng điền đầy đủ thông tin và giá hợp lệ!");
      return false;
    }
    if (priceImport < 0) {
      alert("Giá nhập phải lớn hơn hoặc bằng 0!");
      return false;
    }

    if (priceSell < 0) {
      alert("Giá xuất phải lớn hơn hoặc bằng 0!");
      return false;
    }

    if (priceImport > priceSell) {
      alert("Giá xuất phải lớn hơn hoặc bằng Giá nhập!");
      return false;
    }

    return true;
  };

  const addConfiguration = () => {
    if (!validateConfigForm()) {
      return;
    }

    console.log("Cấu hình mới:", newConfig);
    const romName =
      rom.find((option) => option.ma_rom === Number(newConfig.rom))
        ?.kich_thuoc_rom || "N/A";
    const ramName =
      ram.find((option) => option.ma_ram === Number(newConfig.ram))
        ?.kich_thuoc_ram || "N/A";
    const colorName =
      colors.find((option) => option.ma_mau === Number(newConfig.color))
        ?.ten_mau || "N/A";

    setConfigurations((prev) => [
      ...prev,
      {
        ...newConfig,
        rom: romName,
        ram: ramName,
        color: colorName,
      },
    ]);

    resetForm_nextTab();
  };

  const editConfiguration = (index) => {
    if (editIndex === null) {
      alert("Chọn cấu hình để sửa!");
      return;
    }

    if (!validateConfigForm()) {
      return;
    }

    setConfigurations((prev) =>
      prev.map((config, idx) => (idx === editIndex ? newConfig : config))
    );
    resetForm_nextTab();
  };

  const deleteConfiguration = (index) => {
    if (index < 0 || index >= configurations.length) {
      console.error("Chọn cấu hình hợp lệ để xóa!");
      return;
    }

    console.log("Dữ liệu trước khi xóa:", configurations);

    setConfigurations((prev) => {
      const updatedConfigs = prev.filter((_, idx) => idx !== index);
      console.log("Dữ liệu sau khi xóa:", updatedConfigs);
      return updatedConfigs;
    });
    resetForm_nextTab();
  };

  const handleRowClick = (index) => {
    if (index < 0 || index >= configurations.length) {
      console.error("Chỉ mục không hợp lệ");
      return;
    }
    const selectedConfig = configurations[index];

    setNewConfig(selectedConfig);
    setEditIndex(index);
  };

  const resetForm_nextTab = () => {
    setNewConfig({
      rom: "",
      ram: "",
      color: "",
      priceImport: "",
      priceSell: "",
    });
    setEditIndex(null); // Xóa trạng thái sửa
  };

  const handleNextTab = () => {
    if (!validateProductForm()) {
      return;
    }
    setIsNextTabVisible(true);
  };
  const closeNextTab = () => {
    setIsNextTabVisible(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      resetForm();
      onClose();
    }
  };

  const handleCloseButtonClick = () => {
    resetForm();
    resetForm_nextTab();
    setConfigurations([]);
    onClose();
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      chip: "",
      battery: "",
      screenSize: "",
      frontCamera: "",
      rearCamera: "",
      os: "",
      brand: "",
      origin: "",
      region: "",
    });
    setNewConfig({
      rom: "",
      ram: "",
      color: "",
      priceImport: "",
      priceSell: "",
    });
    setConfigurations([]);
    setErrors({});
    setSelectedImage(null);
    setIsNextTabVisible(false); // Reset về tab đầu tiên
    setEditIndex(null);
  };

  const handleSubmitProduct = async () => {
    if (configurations.length === 0) {
      alert("Không để cấu hình rỗng");
      return;
    }
    try {
      const payLoad = {
        // 1. Thêm sản phẩm vào bảng san_pham
        productData: {
          ten_sp: formData.productName,
          hinh_anh: selectedImage ? selectedImage : "default.jpg", // Giả sử bạn có ảnh mặc định
          chip_xu_ly: formData.chip,
          dung_luong_pin: formData.battery,
          kich_thuoc_man: formData.screenSize,
          camera_truoc: formData.frontCamera,
          camera_sau: formData.rearCamera,
          hdh: formData.os,
          thuong_hieu: formData.brand,
          xuat_xu: formData.origin,
          khu_vuc_kho: formData.region,
          so_luong_ton: 0,
          trang_thai: 1,
        },

        // 2. Thêm cấu hình sản phẩm vào bảng phien_ban_san_pham
        configurationsData: configurations.map((config) => ({
          ma_ram: ram.find((r) => r.kich_thuoc_ram === config.ram)?.ma_ram,
          ma_rom: rom.find((r) => r.kich_thuoc_rom === config.rom)?.ma_rom,
          ma_mau: colors.find((c) => c.ten_mau === config.color)?.ma_mau,
          gia_nhap: config.priceImport,
          gia_xuat: config.priceSell,
          ton_kho: 0, // Bạn có thể thay giá trị tồn kho tùy theo logic của mình
        })),
      };
      const response = await axios.post(
        "http://localhost:5000/api/products",
        payLoad
      );
      if (response.data.success) {
        alert("Thêm sản phẩm thành công!");
        // Reset lại form và các trạng thái sau khi thêm
        resetForm();
        resetForm_nextTab();
        setConfigurations([]);
        onClose();
      } else {
        // Xử lý khi có lỗi từ backend
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm và cấu hình:", error);

      // Xử lý lỗi tùy thuộc vào loại lỗi
      if (error.response) {
        if (error.response.status === 400) {
          alert("Sản phẩm đã tồn tại!");
        } else if (error.response.status === 500) {
          alert("Lỗi từ server. Vui lòng thử lại sau.");
        }
      } else {
        alert("Không thể kết nối tới máy chủ. Kiểm tra kết nối mạng.");
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="add-product-modal">
        <button
          type="button"
          className="close-btn"
          onClick={handleCloseButtonClick}
        >
          X
        </button>
        <h2>THÊM SẢN PHẨM MỚI</h2>
        {!isNextTabVisible ? (
          <form>
            {/* Upload hình ảnh */}
            <div className="image-upload">
              <button type="button" onClick={handleButtonClick}>
                Hình minh họa
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              {selectedImage && (
                <div className="preview-image">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    width="220"
                    height="135"
                  />
                </div>
              )}
            </div>

            {/* Các trường thông tin sản phẩm */}
            {[
              { id: "productName", label: "Tên sản phẩm" },
              { id: "chip", label: "Chip xử lý" },
              { id: "battery", label: "Dung lượng pin" },
              { id: "screenSize", label: "Kích thước màn hình" },
              { id: "frontCamera", label: "Camera trước" },
              { id: "rearCamera", label: "Camera sau" },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id}>{field.label}:</label>
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleInputChange}
                  placeholder={field.label}
                />
                {errors[field.id] && (
                  <span className="error-message-product">
                    {errors[field.id]}
                  </span>
                )}
              </div>
            ))}

            {/* Các trường chọn */}
            {[
              { id: "os", label: "Hệ điều hành", options: os },
              { id: "brand", label: "Thương hiệu", options: brands },
              { id: "origin", label: "Xuất xứ", options: origins },
              { id: "region", label: "Khu vực", options: area },
            ].map((select) => (
              <div key={select.id}>
                <label htmlFor={select.id}>{select.label}:</label>
                <select
                  id={select.id}
                  value={formData[select.id]}
                  onChange={handleInputChange}
                >
                  <option value="">
                    -- Chọn {select.label.toLowerCase()} --
                  </option>
                  {select.options.map((opt) => (
                    <option
                      key={
                        opt.ma_hdh ||
                        opt.ma_thuong_hieu ||
                        opt.ma_xuat_xu ||
                        opt.ma_kho
                      }
                      value={
                        opt.ma_hdh ||
                        opt.ma_thuong_hieu ||
                        opt.ma_xuat_xu ||
                        opt.ma_kho
                      }
                    >
                      {opt.ten_hdh ||
                        opt.ten_thuong_hieu ||
                        opt.ten_xuat_xu ||
                        opt.ten_kho}
                    </option>
                  ))}
                </select>
                {errors[select.id] && (
                  <span className="error-message-product">
                    {errors[select.id]}
                  </span>
                )}
              </div>
            ))}

            {/* Nút hành động */}
            <div className="action-buttons">
              <button
                type="button"
                className="btn-next"
                onClick={handleNextTab}
              >
                Tiếp tục
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCloseButtonClick}
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        ) : (
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="rom">ROM</label>
              <select
                id="rom"
                value={newConfig.rom}
                onChange={handleInputChange_nextTab}
              >
                <option value="">Chọn ROM</option>
                {rom.map((opt) => (
                  <option key={opt.ma_rom} value={opt.ma_rom}>
                    {opt.kich_thuoc_rom}
                  </option>
                ))}
              </select>

              <label htmlFor="ram">RAM</label>
              <select
                id="ram"
                value={newConfig.ram}
                onChange={handleInputChange_nextTab}
              >
                <option value="">Chọn RAM</option>
                {ram.map((opt) => (
                  <option key={opt.ma_ram} value={opt.ma_ram}>
                    {opt.kich_thuoc_ram}
                  </option>
                ))}
              </select>

              <label htmlFor="color">Màu sắc</label>
              <select
                id="color"
                value={newConfig.color}
                onChange={handleInputChange_nextTab}
              >
                <option value="">Chọn Màu sắc</option>
                {colors.map((opt) => (
                  <option key={opt.ma_mau} value={opt.ma_mau}>
                    {opt.ten_mau}
                  </option>
                ))}
              </select>

              <label htmlFor="price-import">Giá nhập</label>
              <input
                type="number"
                id="priceImport"
                value={newConfig.priceImport}
                onChange={handleInputChange_nextTab}
                placeholder="Giá Nhập"
              />

              <label htmlFor="price-sell">Giá xuất</label>
              <input
                type="number"
                id="priceSell"
                value={newConfig.priceSell}
                onChange={handleInputChange_nextTab}
                placeholder="Giá Xuất"
              />
            </div>

            <div className="action-buttons-sp">
              <button className="btn btn-add" onClick={addConfiguration}>
                Thêm cấu hình
              </button>
              <button
                className="btn btn-edit"
                onClick={() => editConfiguration()}
              >
                Sửa cấu hình
              </button>

              <button className="btn btn-reset" onClick={resetForm_nextTab}>
                Làm mới
              </button>
            </div>

            <div className="table-sp">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>ROM</th>
                    <th>RAM</th>
                    <th>Màu sắc</th>
                    <th>Giá nhập</th>
                    <th>Giá xuất</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {configurations.map((config, index) => (
                    <tr key={index} onClick={() => handleRowClick(index)}>
                      <td>{index + 1}</td>
                      <td>{config.rom}</td>
                      <td>{config.ram}</td>
                      <td>{config.color}</td>
                      <td>{config.priceImport}</td>
                      <td>{config.priceSell}</td>
                      <td>
                        <button
                          className="btn btn-delete"
                          onClick={() => deleteConfiguration(index)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="aciton-add-products">
              <button className="add-prodduct-sp" onClick={handleSubmitProduct}>
                Thêm sản phẩm
              </button>
              <button className="comback-sp" onClick={closeNextTab}>
                Quay lại trang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProductModal;
