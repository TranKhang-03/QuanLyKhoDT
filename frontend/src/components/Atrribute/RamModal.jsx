import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import "../Atrribute/BrandModal.css";

const RamModal = ({ isOpen, onClose }) => {
  const [ramList, setRamList] = useState([]);
  const [ramSize, setRamSize] = useState(""); // Chỉ sử dụng kích thước RAM
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch RAM list when modal is open
  useEffect(() => {
    const fetchRams = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/ram");
        setRamList(response.data);
      } catch (error) {
        console.error("Error fetching RAM list:", error);
        setErrorMessage(
          error.response
            ? "Lỗi khi tải danh sách RAM."
            : "Lỗi mạng, vui lòng thử lại."
        );
      }
    };

    if (isOpen) {
      fetchRams();
    }
  }, [isOpen]);

  // Handle adding a new RAM (only size)
  const handleAddRam = async (e) => {
    e.preventDefault();
    if (isNaN(ramSize) || ramSize <= 0 || !Number.isInteger(Number(ramSize))) {
      setErrorMessage("Kích thước RAM phải là số nguyên và lớn hơn 0.");
      document.getElementById("ram-size-input").focus();
      return;
    }

    if (!ramSize || ramSize.trim() === "") {
      setErrorMessage("Kích thước RAM không được để trống");
      document.getElementById("ram-size-input").focus();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/ram", {
        kich_thuoc_ram: ramSize, // Gửi kích thước RAM
      });
      setRamList((prevRams) => [...prevRams, response.data]);
      setRamSize(""); // Reset kích thước RAM
      setErrorMessage(""); // Xóa thông báo lỗi sau khi thành công
      alert("Thêm thành công");
    } catch (error) {
      setErrorMessage(
        error.response && error.response.status === 409
          ? "Kích thước RAM đã tồn tại"
          : "Lỗi khi thêm RAM"
      );
      document.getElementById("ram-size-input").focus();
      console.error("Lỗi khi thêm RAM:", error);
    }
  };

  // Handle editing a RAM size
  const handleEditRam = async () => {
    if (isNaN(ramSize) || ramSize <= 0 || !Number.isInteger(Number(ramSize))) {
      setErrorMessage("Kích thước RAM phải là số nguyên và lớn hơn 0.");
      document.getElementById("ram-size-input").focus();
      return;
    }
    if (ramSize.trim() === "") {
      setErrorMessage("Kích thước RAM không được để trống");
      document.getElementById("ram-size-input").focus();
      return;
    }

    try {
      const ramToUpdate = ramList[editIndex];

      // Gửi yêu cầu PUT để cập nhật kích thước RAM
      await axios.put(`http://localhost:5000/api/ram/${ramToUpdate.ma_ram}`, {
        kich_thuoc_ram: ramSize,
      });

      // Cập nhật lại danh sách RAM trong state
      setRamList((prevRams) =>
        prevRams.map((ram, index) =>
          index === editIndex ? { ...ram, kich_thuoc_ram: ramSize } : ram
        )
      );

      // Reset các giá trị sau khi cập nhật thành công
      setRamSize("");
      setEditIndex(null);
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
      alert("Sửa thành công");
    } catch (error) {
      setErrorMessage(
        error.response
          ? error.response.status === 409
            ? "Kích thước RAM đã tồn tại"
            : "Lỗi khi cập nhật RAM"
          : "Lỗi mạng, vui lòng thử lại"
      );
      console.error("Lỗi khi cập nhật RAM:", error);
      document.getElementById("ram-size-input").focus();
    }
  };

  // Handle selecting a RAM for editing
  const handleRamClick = (index) => {
    setEditIndex(index);
    setRamSize(ramList[index].kich_thuoc_ram); // Lấy kích thước RAM từ bảng
    setErrorMessage("");
  };
  //xóa
  const handleDeleteRam = async (index, e) => {
    const ramToDelete = ramList[index];
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn ẩn RAM với kích thước ${ramToDelete.kich_thuoc_ram}?`
    );

    if (!confirmDelete) return;

    try {
      // Gửi yêu cầu PUT để thay đổi trạng thái RAM thành 0 (ẩn)
      await axios.put(
        `http://localhost:5000/api/ram/${ramToDelete.ma_ram}`,
        { trang_thai: 0 } // Cập nhật trạng thái RAM thành 0
      );

      // Cập nhật lại danh sách RAM trong state
      setRamList((prevRams) =>
        prevRams.map((ram, i) =>
          i === index ? { ...ram, trang_thai: 0 } : ram
        )
      );
      onClose();
      alert("Xóa thành công");
    } catch (error) {
      setErrorMessage("Lỗi khi ẩn RAM");
      console.error("Error deleting RAM:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>RAM</h2>
        <button className="close-btn" onClick={onClose}>
          <MdClose />
        </button>
        <div className="input-container">
          <label>Kích thước RAM</label>
          <input
            id="ram-size-input"
            type="text"
            placeholder="Nhập kích thước RAM"
            value={ramSize || ""}
            onChange={(e) => setRamSize(e.target.value)}
          />
          {errorMessage && (
            <p className="error-message-brand">{errorMessage}</p>
          )}
        </div>

        <div className="brand-table-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Mã RAM</th>
                <th>Kích thước RAM</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {ramList.map((ram, index) => (
                <tr key={ram.ma_ram} onClick={() => handleRamClick(index)}>
                  <td>{ram.ma_ram}</td>
                  <td>{ram.kich_thuoc_ram}</td>
                  <td>
                    <button
                      className="btn-delete-modal"
                      onClick={(e) => handleDeleteRam(index, e)}
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
          <button className="add-btn-modal" onClick={handleAddRam}>
            Thêm
          </button>

          <button className="edit-btn-modal" onClick={handleEditRam}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RamModal;
