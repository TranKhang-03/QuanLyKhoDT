import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import "../Atrribute/BrandModal.css";

const ColorModal = ({ isOpen, onClose }) => {
  const [colors, setColors] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch colors when modal is open
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/color");
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error);
        setErrorMessage(
          error.response
            ? "Lỗi khi tải danh sách màu sắc."
            : "Lỗi mạng, vui lòng thử lại."
        );
      }
    };

    if (isOpen) {
      fetchColors();
    }
  }, [isOpen]);

  // Handle adding a new color
  const handleAddColor = async (e) => {
    e.preventDefault();

    if (!newColor || newColor.trim() === "") {
      setErrorMessage("Tên màu sắc không được để trống");
      document.getElementById("color-input").focus();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/color", {
        ten_mau: newColor, // Sử dụng tên cột đúng
      });
      setColors((prevColors) => [...prevColors, response.data]);
      setNewColor("");
      setErrorMessage("");
      alert("Thêm thành công");
    } catch (error) {
      setErrorMessage(
        error.response && error.response.status === 409
          ? "Tên màu sắc đã tồn tại"
          : "Lỗi khi thêm màu sắc"
      );
      document.getElementById("color-input").focus();
      console.error("Lỗi khi thêm màu sắc:", error);
    }
  };

  // Handle editing a color
  const handleEditColor = async () => {
    if (newColor.trim() === "") {
      setErrorMessage("Tên màu sắc không được để trống");
      document.getElementById("color-input").focus();
      return;
    }

    try {
      const colorToUpdate = colors[editIndex];

      // Gửi yêu cầu PUT để cập nhật tên màu sắc
      await axios.put(
        `http://localhost:5000/api/color/${colorToUpdate.ma_mau}`,
        { ten_mau: newColor } // Cập nhật tên màu sắc
      );

      // Cập nhật lại danh sách màu sắc trong state
      setColors((prevColors) =>
        prevColors.map((color, index) =>
          index === editIndex ? { ...color, ten_mau: newColor } : color
        )
      );

      // Reset các giá trị sau khi cập nhật thành công
      setNewColor("");
      setEditIndex(null);
      setErrorMessage("");
      alert("Sửa thành công");
    } catch (error) {
      setErrorMessage(
        error.response
          ? error.response.status === 409
            ? "Tên màu sắc đã tồn tại"
            : "Lỗi khi cập nhật màu sắc"
          : "Lỗi mạng, vui lòng thử lại"
      );
      console.error("Lỗi khi cập nhật màu sắc:", error);
      document.getElementById("color-input").focus();
    }
  };

  // Handle selecting a color for editing
  const handleColorClick = (index) => {
    setEditIndex(index);
    setNewColor(colors[index].ten_mau); // Lấy tên màu sắc từ bảng
    setErrorMessage("");
  };

  // Handle hiding a color with confirmation
  const handleDeleteColor = async (index, e) => {
    e.stopPropagation(); // Ngừng sự kiện tiếp theo

    const colorToDelete = colors[index];
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn ẩn màu sắc ${colorToDelete.ten_mau}?`
    );

    if (!confirmDelete) return;

    try {
      // Gửi yêu cầu PUT để cập nhật trạng thái màu sắc thành 0 (ẩn)
      await axios.put(
        `http://localhost:5000/api/color/${colorToDelete.ma_mau}`,
        { trang_thai: 0 }
      );

      // Cập nhật lại state sau khi ẩn thành công
      setColors((prevColors) =>
        prevColors.map((color, i) =>
          i === index ? { ...color, trang_thai: 0 } : color
        )
      );
      onClose();
      alert("Xóa màu sắc thành công");
    } catch (error) {
      setErrorMessage("Lỗi khi ẩn màu sắc");
      console.error("Error hiding color:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>MÀU SẮC</h2>
        <button className="close-btn" onClick={onClose}>
          <MdClose />
        </button>
        <div className="input-container">
          <label>Tên màu sắc</label>
          <input
            id="color-input"
            type="text"
            placeholder="Nhập tên màu sắc"
            value={newColor || ""}
            onChange={(e) => setNewColor(e.target.value)}
          />
          {errorMessage && (
            <p className="error-message-brand">{errorMessage}</p>
          )}
        </div>

        <div className="brand-table-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Mã màu sắc</th>
                <th>Tên màu sắc</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color, index) => (
                <tr key={color.ma_mau} onClick={() => handleColorClick(index)}>
                  <td>{color.ma_mau}</td>
                  <td>{color.ten_mau}</td>
                  <td>
                    <button
                      className="btn-delete-modal"
                      onClick={(e) => handleDeleteColor(index, e)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="button-container">
          <button className="add-btn-modal" onClick={handleAddColor}>
            Thêm
          </button>

          <button className="edit-btn-modal" onClick={handleEditColor}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorModal;
