import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Product/style.css"; // Đường dẫn tới file CSS
import "../Product/next-tab.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const AddConfig = ({ show, onClose, product }) => {
  const [colors, setColors] = useState([]);
  const [ram, setRam] = useState([]);
  const [rom, setRom] = useState([]);
  const [editConfig, setEditConfig] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [configurations, setConfigurations] = useState([]);

  const [newConfig, setNewConfig] = useState({
    rom: "",
    ram: "",
    color: "",
    priceImport: "",
    priceSell: "",
  });

  useEffect(() => {
    if (product) {
      console.log(product);
    }
    const fetchData = async () => {
      try {
        const [colorReponse, ramReponse, romReponse] = await Promise.all([
          axios.get("http://localhost:5000/api/color"),
          axios.get("http://localhost:5000/api/ram"),
          axios.get("http://localhost:5000/api/rom"),
        ]);

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
  //
  const handleRowClick = (index) => {
    if (index < 0 || index >= configurations.length) {
      console.error("Chỉ mục không hợp lệ");
      return;
    }
    const selectedConfig = configurations[index];

    setNewConfig(selectedConfig);
    setEditIndex(index);
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
  const handleInputChange_nextTab = (e) => {
    const { id, value } = e.target;
    setNewConfig((prev) => ({
      ...prev,
      [id]: value,
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

  const updatedConfigs = () => {
    if (!validateConfigForm()) return; // Kiểm tra dữ liệu nhập

    if (editIndex === null) {
      alert("Không có cấu hình nào được chọn để chỉnh sửa!");
      return;
    }

    const romName =
      rom.find((option) => option.ma_rom === Number(newConfig.rom))
        ?.kich_thuoc_rom || "N/A";
    const ramName =
      ram.find((option) => option.ma_ram === Number(newConfig.ram))
        ?.kich_thuoc_ram || "N/A";
    const colorName =
      colors.find((option) => option.ma_mau === Number(newConfig.color))
        ?.ten_mau || "N/A";

    // Tạo cấu hình đã chỉnh sửa
    const updatedConfig = {
      rom: romName,
      ram: ramName,
      color: colorName,
      priceImport: newConfig.priceImport,
      priceSell: newConfig.priceSell,
    };

    setConfigurations((prev) =>
      prev.map((config, idx) => (idx === editIndex ? updatedConfig : config))
    );

    // Đặt lại form và trạng thái chỉnh sửa
    resetForm_nextTab();
    setEditIndex(null);
  };

  const handleCloseModal = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleSubmitConfigProduct = async () => {
    // Kiểm tra danh sách cấu hình trước khi gửi
    if (configurations.length === 0) {
      alert("Danh sách cấu hình không được để trống!");
      return;
    }

    try {
      // Tạo payload gửi lên server
      const payLoad = {
        ma_sp: product.ma_sp,
        configurationsData: configurations.map((config) => ({
          ma_ram: ram.find((r) => r.kich_thuoc_ram === config.ram)?.ma_ram,
          ma_rom: rom.find((r) => r.kich_thuoc_rom === config.rom)?.ma_rom,
          ma_mau: colors.find((c) => c.ten_mau === config.color)?.ma_mau,
          gia_nhap: config.priceImport,
          gia_xuat: config.priceSell,
          ton_kho: 0, // Tồn kho mặc định là 0
        })),
      };

      // Gửi yêu cầu lên backend
      const { data } = await axios.post(
        "http://localhost:5000/api/pbsp",
        payLoad
      );

      if (data.success) {
        const { addedConfigurations = [], duplicateConfigurations = [] } =
          data.data;

        // Thông báo cấu hình thêm thành công
        if (addedConfigurations.length > 0) {
          alert(
            `Đã thêm ${addedConfigurations.length} cấu hình thành công:\n` +
              addedConfigurations
                .map(
                  (config) =>
                    `- RAM: ${config.ma_ram}, ROM: ${config?.ma_rom}, Màu: ${config?.ma_mau}`
                )
                .join("\n")
          );
        }

        // Thông báo cấu hình bị trùng lặp
        if (duplicateConfigurations.length > 0) {
          alert(
            `Có ${duplicateConfigurations.length} cấu hình bị trùng lặp:\n` +
              duplicateConfigurations
                .map(
                  (config) =>
                    `- RAM: ${config.config.ma_ram}, ROM: ${config.config.ma_rom}, Màu: ${config.config.ma_mau} (Lý do: ${config.reason})`
                )
                .join("\n")
          );
        }

        // Reset form và trạng thái
        resetForm_nextTab();
        setConfigurations([]);
        onClose();
      } else {
        alert(data.message || "Có lỗi xảy ra. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm và cấu hình:", error);

      // Xử lý lỗi từ backend
      if (error.response) {
        switch (error.response.status) {
          case 400:
            alert(error.response.data.message || "Dữ liệu không hợp lệ!");
            break;
          case 500:
            alert("Lỗi server. Vui lòng thử lại sau.");
            break;
          default:
            alert(
              `Lỗi không xác định: ${
                error.response.data.message || "Vui lòng thử lại!"
              }`
            );
        }
      } else {
        alert("Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.");
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
        <h2>THÊM CẤU HÌNH SẢN PHẨM</h2>
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
            <button className="btn btn-add" onClick={addConfiguration}>
              Thêm cấu hình
            </button>
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
                {configurations.map((config, index) => (
                  <tr key={index} onClick={() => handleRowClick(index)}>
                    <td>{index + 1}</td>
                    <td>{config.rom}</td>
                    <td>{config.ram}</td>
                    <td>{config.color}</td>
                    <td>{config.priceImport}</td>
                    <td>{config.priceSell}</td>
                    <td>
                      <div className="action-button">
                        <button className="btn-config-edit">
                          <FaEdit />
                        </button>
                        <button
                          className="btn-config-delete"
                          onClick={() => deleteConfiguration(index)}
                        >
                          <FaTrash />
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
              onClick={handleSubmitConfigProduct}
            >
              Tạo cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddConfig;
