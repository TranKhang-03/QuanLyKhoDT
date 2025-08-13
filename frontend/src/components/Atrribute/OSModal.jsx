import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import "../Atrribute/BrandModal.css";

const OSModal = ({ isOpen, onClose }) => {
  const [operatingSystems, setOperatingSystems] = useState([]);
  const [newOS, setNewOS] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch operating systems when modal is open
  useEffect(() => {
    const fetchOperatingSystems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/os");
        setOperatingSystems(response.data);
      } catch (error) {
        console.error("Error fetching operating systems:", error);
        if (error.response) {
          setErrorMessage("Lỗi khi tải danh sách hệ điều hành.");
        } else {
          setErrorMessage("Lỗi mạng, vui lòng thử lại.");
        }
      }
    };

    if (isOpen) {
      fetchOperatingSystems();
    }
  }, [isOpen]);

  // Handle adding a new OS
  const handleAddOS = async (e) => {
    e.preventDefault();

    if (!newOS || newOS.trim() === "") {
      setErrorMessage("Tên hệ điều hành không được để trống");
      document.getElementById("os-input").focus();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/os", {
        ten_hdh: newOS, // Sử dụng tên cột đúng
      });
      setOperatingSystems((prevOS) => [...prevOS, response.data]);
      setNewOS("");
      setErrorMessage("");
      alert("Thêm thành công");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage("Tên hệ điều hành đã tồn tại");
        document.getElementById("os-input").focus();
      } else {
        setErrorMessage("Lỗi khi thêm hệ điều hành");
        console.error("Lỗi khi thêm hệ điều hành:", error);
      }
    }
  };

  const handleEditOS = async () => {
    if (newOS.trim() === "") {
      setErrorMessage("Tên hệ điều hành không được để trống");
      document.getElementById("os-input").focus();
      return;
    }

    try {
      const osToUpdate = operatingSystems[editIndex];

      // Gửi yêu cầu PUT để cập nhật tên hệ điều hành
      await axios.put(
        `http://localhost:5000/api/os/${osToUpdate.ma_hdh}`,
        { ten_hdh: newOS } // Cập nhật tên hệ điều hành
      );

      // Cập nhật lại danh sách hệ điều hành trong state
      setOperatingSystems((prevOS) =>
        prevOS.map((os, index) =>
          index === editIndex ? { ...os, ten_hdh: newOS } : os
        )
      );

      // Reset các giá trị sau khi cập nhật thành công
      setNewOS("");
      setEditIndex(null);
      setErrorMessage("");
      alert("Sửa thành công");
    } catch (error) {
      // Kiểm tra lỗi phản hồi từ backend
      if (error.response) {
        if (error.response.status === 409) {
          // Lỗi khi tên hệ điều hành đã tồn tại
          setErrorMessage("Tên hệ điều hành đã tồn tại");
        } else if (error.response.status === 400) {
          // Lỗi tên hệ điều hành trống
          setErrorMessage("Tên hệ điều hành không được để trống");
        } else {
          setErrorMessage("Lỗi khi cập nhật hệ điều hành");
          console.error("Lỗi khi cập nhật hệ điều hành:", error);
        }
      } else {
        // Nếu có lỗi mạng (network error)
        setErrorMessage("Lỗi mạng, vui lòng thử lại");
        console.error("Lỗi mạng:", error);
      }
      document.getElementById("os-input").focus(); // Focus vào input nếu có lỗi
    }
  };

  // Handle deleting an OS with confirmation
  const handleDeleteOS = async (index) => {
    const osToDelete = operatingSystems[index];
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa hệ điều hành ${osToDelete.ten_hdh}?`
    );

    if (!confirmDelete) return;

    try {
      await axios.put(`http://localhost:5000/api/os/${osToDelete.ma_hdh}`, {
        trang_thai: 0,
      });
      setOperatingSystems((prevOperatingSystems) =>
        prevOperatingSystems.map((os, i) =>
          i === index ? { ...os, trang_thai: 0 } : os
        )
      );
      onClose();
      alert("Xóa hệ điều hành thành công");
    } catch (error) {
      setErrorMessage("Lỗi khi xóa hệ điều hành");
      console.error("Error deleting OS:", error);
    }
  };

  // Handle selecting an OS for editing
  const handleOSClick = (index) => {
    setEditIndex(index);
    setNewOS(operatingSystems[index].ten_hdh); // Lấy tên hệ điều hành từ bảng
    setErrorMessage("");
  };

  // Render modal if open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>HỆ ĐIỀU HÀNH</h2>
        <button className="close-btn" onClick={onClose}>
          <MdClose />
        </button>
        <div className="input-container">
          <label>Tên hệ điều hành</label>
          <input
            id="os-input"
            type="text"
            placeholder="Nhập tên hệ điều hành"
            value={newOS || ""}
            onChange={(e) => setNewOS(e.target.value)}
          />
          {errorMessage && (
            <p className="error-message-brand">{errorMessage}</p>
          )}
        </div>

        <div className="brand-table-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Mã hệ điều hành</th>
                <th>Tên hệ điều hành</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {operatingSystems.map((os, index) => (
                <tr key={os.ma_hdh} onClick={() => handleOSClick(index)}>
                  <td>{os.ma_hdh}</td>
                  <td>{os.ten_hdh}</td>
                  <td>
                    <button
                      className="btn-delete-modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOS(index);
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
          <button className="add-btn-modal" onClick={handleAddOS}>
            Thêm
          </button>

          <button className="edit-btn-modal" onClick={handleEditOS}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default OSModal;
