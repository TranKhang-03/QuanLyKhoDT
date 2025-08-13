import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Product/style.css"; // Đường dẫn tới file CSS
import "../Product/next-tab.css";
import { FaPlus, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";

const UpdateProduct = ({ show, onClose, product }) => {
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
  const [editConfig, setEditConfig] = useState(null);
  const [editIndex, setEditIndex] = useState(null); // Quản lý trạng thái chỉnh sửa

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
    if (product) {
      setFormData({
        productName: product.ten_sp,
        chip: product.chip_xu_ly,
        battery: product.dung_luong_pin,
        screenSize: product.kich_thuoc_man,
        frontCamera: product.camera_truoc,
        rearCamera: product.camera_sau,
        os: product.operatingSystem?.ten_hdh,
        brand: product.brand?.ten_thuong_hieu,
        origin: product.origin?.ten_xuat_xu,
        region: product.storageArea?.ten_kho,
      });
    }
    const fetchData = async () => {
      try {
        const [
          brandResponse,
          originResponse,
          osResponse,
          areaReponse,
          colorReponse,
          ramReponse,
          romReponse,
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/brands"),
          axios.get("http://localhost:5000/api/origins"),
          axios.get("http://localhost:5000/api/os"),
          axios.get("http://localhost:5000/api/warehouses"),
          axios.get("http://localhost:5000/api/color"),
          axios.get("http://localhost:5000/api/ram"),
          axios.get("http://localhost:5000/api/rom"),
        ]);

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
  }, [product]);
  if (!show) return null;
  const addConfiguration = () => {
    if (!validateConfigForm()) {
      return;
    }

    console.log("Cấu hình mới:", newConfig);

    // Lấy tên ROM, RAM và màu sắc từ dữ liệu
    const romName =
      rom.find((option) => option.ma_rom === Number(newConfig.rom))
        ?.kich_thuoc_rom || "N/A";
    const ramName =
      ram.find((option) => option.ma_ram === Number(newConfig.ram))
        ?.kich_thuoc_ram || "N/A";
    const colorName =
      colors.find((option) => option.ma_mau === Number(newConfig.color))
        ?.ten_mau || "N/A";

    // Tạo đối tượng cấu hình mới
    const newConfigData = {
      ram: ramName,
      rom: romName,
      color: colorName,
      priceImport: newConfig.priceImport,
      priceSell: newConfig.priceSell,
    };

    resetForm_nextTab();
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "", // Xóa lỗi khi nhập
    }));
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
  const handleInputChange_nextTab = (e) => {
    const { id, value } = e.target;
    setNewConfig((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleNextTab = () => {
    // if (!validateProductForm()) {
    //   return;
    // }
    setIsNextTabVisible(true);
  };
  const closeNextTab = () => {
    setIsNextTabVisible(false);
  };
  const handleUpdateConfig = (item, index) => {
    setEditConfig(item);
    setNewConfig({
      rom:
        rom.find((r) => r.kich_thuoc_rom === item.rom.kich_thuoc_rom)?.ma_rom ||
        "",
      ram:
        ram.find((r) => r.kich_thuoc_ram === item.ram.kich_thuoc_ram)?.ma_ram ||
        "",
      color:
        colors.find((c) => c.ten_mau === item.mauSac.ten_mau)?.ma_mau || "",
      priceImport: item.gia_nhap || "",
      priceSell: item.gia_xuat || "",
    });
    setEditIndex(index); // Lưu lại chỉ số cấu hình đang chỉnh sửa
  };
  const updatedConfigs = () => {
    if (!validateConfigForm()) return; // Kiểm tra dữ liệu nhập

    const romName =
      rom.find((option) => option.ma_rom === Number(newConfig.rom))
        ?.kich_thuoc_rom || "N/A";
    const ramName =
      ram.find((option) => option.ma_ram === Number(newConfig.ram))
        ?.kich_thuoc_ram || "N/A";
    const colorName =
      colors.find((option) => option.ma_mau === Number(newConfig.color))
        ?.ten_mau || "N/A";

    const updatedConfig = {
      rom: { kich_thuoc_rom: romName },
      ram: { kich_thuoc_ram: ramName },
      mauSac: { ten_mau: colorName },
      gia_nhap: newConfig.priceImport,
      gia_xuat: newConfig.priceSell,
    };

    // Cập nhật danh sách cấu hình
    const updatedConfigurations = [...product.phienBanSanPhams];
    if (editIndex !== null) {
      updatedConfigurations[editIndex] = updatedConfig; // Sửa cấu hình hiện tại
      product.phienBanSanPhams[editIndex] = updatedConfigurations[editIndex];
      setEditIndex(null); // Xóa trạng thái chỉnh sửa
    }

    setNewConfig({
      rom: "",
      ram: "",
      color: "",
      priceImport: "",
      priceSell: "",
    });
    setEditConfig(null);
  };
 
  const handleDeleteConfig = (index) => {
    const updatedConfigurations = product.phienBanSanPhams.filter((_,i)=> i!== index)
    product.phienBanSanPhams = updatedConfigurations; // Cập nhật lại danh sách
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
      onClose();
    }
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleSubmitUpdateProduct = async () => {
    // if (!validateConfigForm()) return;
    try {
      const configurationsData = product.phienBanSanPhams.map((item) => ({
        ma_ram: ram.find((r) => r.kich_thuoc_ram === item.ram.kich_thuoc_ram)
          ?.ma_ram,
        ma_rom: rom.find((r) => r.kich_thuoc_rom === item.rom.kich_thuoc_rom)
          ?.ma_rom,
        ma_mau: colors.find((r) => r.ten_mau === item.mauSac.ten_mau)?.ma_mau,
        gia_nhap: item.gia_nhap,
        gia_xuat: item.gia_xuat,
      }));
      if (
        newConfig.rom &&
        newConfig.ram &&
        newConfig.color &&
        newConfig.priceImport &&
        newConfig.priceSell
      ) {
        configurationsData.push({
          ma_ram: newConfig.ram,
          ma_rom: newConfig.rom,
          ma_mau: newConfig.color,
          gia_nhap: parseInt(newConfig.priceImport, 10),
          gia_xuat: parseInt(newConfig.priceSell, 10),
        });
      }
      // const product
      const UpdateProduct = {
        productData: {
          ten_sp: formData.productName,
          hinh_anh: selectedImage || product.hinh_anh, // Giả sử bạn có ảnh mặc định
          chip_xu_ly: formData.chip,
          dung_luong_pin: formData.battery,
          kich_thuoc_man: formData.screenSize,
          camera_truoc: formData.frontCamera,
          camera_sau: formData.rearCamera,
          hdh: os.find((r) => r.ten_hdh === formData.os)?.ma_hdh,
          thuong_hieu: brands.find((r) => r.ten_thuong_hieu === formData.brand)
            ?.ma_thuong_hieu,
          xuat_xu: origins.find((r) => r.ten_xuat_xu === formData.origin)
            ?.ma_xuat_xu,
          khu_vuc_kho: area.find((r) => r.ten_kho === formData.region)?.ma_kho,
          trang_thai: 1,
        },
        configurationsData,
      };
      // Send the data to the backend
      const response = await axios.put(
        `http://localhost:5000/api/products/${product.ma_sp}`,
        UpdateProduct
      );

      if (response.data.success) {
        alert("Cập nhật sản phẩm thành công!");
        onClose();
      }
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
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
        <h2>CHỈNH SỬA SẢN PHẨM</h2>
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
              {
                id: "productName",
                label: "Tên sản phẩm",
                value: product.ten_sp,
              },
              { id: "chip", label: "Chip xử lý", value: product.chip_xu_ly },
              {
                id: "battery",
                label: "Dung lượng pin",
                value: product.dung_luong_pin,
              },
              {
                id: "screenSize",
                label: "Kích thước màn hình",
                value: product.kich_thuoc_man,
              },
              {
                id: "frontCamera",
                label: "Camera trước",
                value: product.camera_truoc,
              },
              {
                id: "rearCamera",
                label: "Camera sau",
                value: product.camera_sau,
              },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id}>{field.label}:</label>
                <input
                  type="text"
                  id={field.id}
                  value={formData[field.id] || field.value}
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
            <div>
              <label htmlFor="os">Hệ điều hành:</label>
              <select
                id="os"
                value={formData.os || ""}
                onChange={(e) => handleInputChange(e)} // Xử lý thay đổi
              >
                {os.map((opt) => (
                  <option key={opt.ma_hdh} value={opt.ten_hdh}>
                    {opt.ten_hdh}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="brand">Thương hiệu:</label>
              <select
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange(e)} // Xử lý thay đổi
              >
                {brands.map((opt) => (
                  <option key={opt.ma_thuong_hieu} value={opt.ten_thuong_hieu}>
                    {opt.ten_thuong_hieu}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="origin">Xuất xứ:</label>
              <select
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange(e)} // Xử lý thay đổi
              >
                {origins.map((opt) => (
                  <option key={opt.ma_xuat_xu} value={opt.ten_xuat_xu}>
                    {opt.ten_xuat_xu}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="region">Khu vực:</label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange(e)} // Xử lý thay đổi
              >
                {area.map((opt) => (
                  <option key={opt.ma_kho} value={opt.ten_kho}>
                    {opt.ten_kho}
                  </option>
                ))}
              </select>
            </div>

            {/* Các trường chọn */}

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
              <select id="rom" value={newConfig.rom}>
                <option value="">Chọn ROM</option>
                {rom.map((opt) => (
                  <option
                    key={opt.ma_rom}
                    value={opt.ma_rom}
                    onChange={handleInputChange_nextTab}
                  >
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
                  <option
                    key={opt.ma_mau}
                    value={opt.ma_mau}
                    onChange={handleInputChange_nextTab}
                  >
                    {opt.ten_mau}
                  </option>
                ))}
              </select>

              <label htmlFor="price-import">Giá nhập</label>
              <input
                type="number"
                id="priceImport"
                value={newConfig.priceImport}
                placeholder="Giá Nhập"
                onChange={handleInputChange_nextTab}
              />

              <label htmlFor="price-sell">Giá xuất</label>
              <input
                type="number"
                id="priceSell"
                value={newConfig.priceSell}
                placeholder="Giá Xuất"
                onChange={handleInputChange_nextTab}
              />
            </div>

            <div className="action-buttons-sp">
              <button className="btn btn-update" onClick={updatedConfigs}>
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
                  {product.phienBanSanPhams.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.rom.kich_thuoc_rom}</td>
                      <td>{item.ram.kich_thuoc_ram}</td>
                      <td>{item.mauSac?.ten_mau}</td>
                      <td>{item.gia_nhap}</td>
                      <td>{item.gia_xuat}</td>
                      <td>
                        <div className="action-button">
                          <button
                            className="btn-config-edit"
                            onClick={() => handleUpdateConfig(item, index)}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="aciton-add-products">
              <button
                className="add-prodduct-sp"
                onClick={handleSubmitUpdateProduct}
              >
                Sửa sản phẩm
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

export default UpdateProduct;
