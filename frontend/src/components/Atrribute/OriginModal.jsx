import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import "../Atrribute/BrandModal.css";

const OriginModal = ({ isOpen, onClose }) => {
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch origins when modal is open
  useEffect(() => {
    const fetchOrigins = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/origins");
        setOrigins(response.data);
      } catch (error) {
        console.error("Error fetching origins:", error);
        if (error.response) {
          setErrorMessage("Lỗi khi tải danh sách xuất xứ.");
        } else {
          setErrorMessage("Lỗi mạng, vui lòng thử lại.");
        }
      }
    };

    if (isOpen) {
      fetchOrigins();
    }
  }, [isOpen]);

  // Handle adding a new origin
  const handleAddOrigin = async (e) => {
    e.preventDefault();

    if (!newOrigin || newOrigin.trim() === "") {
      setErrorMessage("Tên xuất xứ không được để trống");
      document.getElementById("origin-input").focus();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/origins", {
        ten_xuat_xu: newOrigin, // Sử dụng tên cột đúng
      });
      setOrigins((prevOrigins) => [...prevOrigins, response.data]);
      setNewOrigin("");
      setErrorMessage("");
      alert("Thêm thành công");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Tên xuất xứ đã tồn tại");
        document.getElementById("origin-input").focus();
      } else {
        setErrorMessage("Lỗi khi thêm xuất xứ");
        console.error("Lỗi khi thêm xuất xứ:", error);
      }
    }
  };

  const handleEditOrigin = async () => {
    if (newOrigin.trim() === "") {
      setErrorMessage("Tên xuất xứ không được để trống");
      document.getElementById("origin-input").focus();
      return;
    }

    try {
      const originToUpdate = origins[editIndex];

      // Gửi yêu cầu PUT để cập nhật tên xuất xứ
      await axios.put(
        `http://localhost:5000/api/origins/${originToUpdate.ma_xuat_xu}`,
        { ten_xuat_xu: newOrigin } // Cập nhật tên xuất xứ
      );

      // Cập nhật lại danh sách xuất xứ trong state
      setOrigins((prevOrigins) =>
        prevOrigins.map((origin, index) =>
          index === editIndex ? { ...origin, ten_xuat_xu: newOrigin } : origin
        )
      );

      // Reset các giá trị sau khi cập nhật thành công
      setNewOrigin("");
      setEditIndex(null);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
      alert("Sửa thành công");
    } catch (error) {
      // Kiểm tra lỗi phản hồi từ backend
      if (error.response) {
        if (error.response.status === 409) {
          // Lỗi khi tên xuất xứ đã tồn tại
          setErrorMessage("Tên xuất xứ đã tồn tại");
        } else if (error.response.status === 400) {
          // Lỗi tên xuất xứ trống
          setErrorMessage("Tên xuất xứ không được để trống");
        } else {
          setErrorMessage("Lỗi khi cập nhật xuất xứ");
          console.error("Lỗi khi cập nhật xuất xứ:", error);
        }
      } else {
        // Nếu có lỗi mạng (network error)
        setErrorMessage("Lỗi mạng, vui lòng thử lại");
        console.error("Lỗi mạng:", error);
      }
      document.getElementById("origin-input").focus();
    }
  };

  // Handle selecting an origin for editing
  const handleOriginClick = (index) => {
    setEditIndex(index);
    setNewOrigin(origins[index].ten_xuat_xu); // Lấy tên xuất xứ từ bảng
    setErrorMessage("");
  };

  //Xóa
  const handleDeleteOrigin = async (index) => {
    const originToDelete = origins[index];
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa xuất xứ ${originToDelete.ten_xuat_xu}?`
    );

    if (!confirmDelete) return;

    try {
      // Gửi yêu cầu PUT để cập nhật trạng thái của xuất xứ thành 0 (ẩn)
      await axios.put(
        `http://localhost:5000/api/origins/${originToDelete.ma_xuat_xu}`,
        { trang_thai: 0 }
      );

      // Cập nhật lại state sau khi xóa thành công
      setOrigins((prevOrigins) =>
        prevOrigins.map((origin, i) =>
          i === index ? { ...origin, trang_thai: 0 } : origin
        )
      );

      onClose(); // Đóng modal sau khi xóa thành công
      alert("Xóa xuất xứ thành công");
    } catch (error) {
      if (error.response) {
        console.error("Error deleting origin:", error.response.data);
        setErrorMessage(error.response.data.error || "Lỗi khi xóa xuất xứ");
      } else {
        console.error("Error deleting origin:", error);
        setErrorMessage("Lỗi khi xóa xuất xứ");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>XUẤT XỨ SẢN PHẨM</h2>
        <button className="close-btn" onClick={onClose}>
          <MdClose />
        </button>
        <div className="input-container">
          <label>Tên xuất xứ</label>
          <input
            id="origin-input"
            type="text"
            placeholder="Nhập tên xuất xứ"
            value={newOrigin || ""}
            onChange={(e) => setNewOrigin(e.target.value)}
          />
          {errorMessage && (
            <p className="error-message-brand">{errorMessage}</p>
          )}
        </div>

        <div className="brand-table-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Mã xuất xứ</th>
                <th>Tên xuất xứ</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {origins.map((origin, index) => (
                <tr
                  key={origin.ma_xuat_xu}
                  onClick={() => handleOriginClick(index)}
                >
                  <td>{origin.ma_xuat_xu}</td>
                  <td>{origin.ten_xuat_xu}</td>
                  <td>
                    <button
                      className="btn-delete-modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOrigin(index);
                      }}
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
          <button className="add-btn-modal" onClick={handleAddOrigin}>
            Thêm
          </button>

          <button className="edit-btn-modal" onClick={handleEditOrigin}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default OriginModal;
