import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import axios from "axios";
import "../Atrribute/BrandModal.css";

const RomModal = ({ isOpen, onClose }) => {
  const [romList, setRomList] = useState([]);
  const [romSize, setRomSize] = useState(""); // Chỉ sử dụng kích thước ROM
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch ROM list when modal is open
  useEffect(() => {
    const fetchRoms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rom");
        setRomList(response.data);
      } catch (error) {
        console.error("Error fetching ROM list:", error);
        setErrorMessage(
          error.response
            ? "Lỗi khi tải danh sách ROM."
            : "Lỗi mạng, vui lòng thử lại."
        );
      }
    };

    if (isOpen) {
      fetchRoms();
    }
  }, [isOpen]);

  // Handle adding a new ROM (only size)
  const handleAddRom = async (e) => {
    e.preventDefault();

    if (!romSize || romSize.trim() === "") {
      setErrorMessage("Kích thước ROM không được để trống");
      document.getElementById("rom-size-input").focus();
      return;
    }
    if (isNaN(romSize) || romSize <= 0 || !Number.isInteger(Number(romSize))) {
      setErrorMessage("Kích thước ROM phải là số nguyên và lớn hơn 0.");
      document.getElementById("rom-size-input").focus();
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/rom", {
        kich_thuoc_rom: romSize, // Gửi kích thước ROM
      });
      setRomList((prevRoms) => [...prevRoms, response.data]);
      setRomSize(""); // Reset kích thước ROM
      setErrorMessage("");
      alert("Thêm thành công");
    } catch (error) {
      setErrorMessage(
        error.response && error.response.status === 409
          ? "Kích thước ROM đã tồn tại"
          : "Lỗi khi thêm ROM"
      );
      document.getElementById("rom-size-input").focus();
      console.error("Lỗi khi thêm ROM:", error);
    }
  };

  // Handle editing a ROM size
  const handleEditRom = async () => {
    if (romSize.trim() === "") {
      setErrorMessage("Kích thước ROM không được để trống");
      document.getElementById("rom-size-input").focus();
      return;
    }
    if (isNaN(romSize) || romSize <= 0 || !Number.isInteger(Number(romSize))) {
      setErrorMessage("Kích thước ROM phải là số nguyên và lớn hơn 0.");
      document.getElementById("rom-size-input").focus();
      return;
    }

    try {
      const romToUpdate = romList[editIndex];

      // Gửi yêu cầu PUT để cập nhật kích thước ROM
      await axios.put(`http://localhost:5000/api/rom/${romToUpdate.ma_rom}`, {
        kich_thuoc_rom: romSize,
      });

      // Cập nhật lại danh sách ROM trong state
      setRomList((prevRoms) =>
        prevRoms.map((rom, index) =>
          index === editIndex ? { ...rom, kich_thuoc_rom: romSize } : rom
        )
      );

      // Reset các giá trị sau khi cập nhật thành công
      setRomSize("");
      setEditIndex(null);
      setErrorMessage("");
      alert("Sửa thành công");
    } catch (error) {
      setErrorMessage(
        error.response
          ? error.response.status === 409
            ? "Kích thước ROM đã tồn tại"
            : "Lỗi khi cập nhật ROM"
          : "Lỗi mạng, vui lòng thử lại"
      );
      console.error("Lỗi khi cập nhật ROM:", error);
      document.getElementById("rom-size-input").focus();
    }
  };

  const handleDeleteRom = async (index, e) => {
    e.stopPropagation(); // Ngừng sự kiện tiếp theo

    const romToDelete = romList[index];
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa ROM với kích thước ${romToDelete.kich_thuoc_rom}?`
    );

    if (!confirmDelete) return;

    try {
      await axios.put(`http://localhost:5000/api/rom/${romToDelete.ma_rom}`, {
        trang_thai: 0,
      });

      setRomList((prevRoms) =>
        prevRoms.map((rom, i) =>
          i === index ? { ...rom, trang_thai: 0 } : rom
        )
      );
      onClose();
      alert("Xóa thành công");
    } catch (error) {
      setErrorMessage("Lỗi khi ẩn ROM");
      console.error("Error hiding ROM:", error);
    }
  };

  // Handle selecting a ROM for editing
  const handleRomClick = (index) => {
    setEditIndex(index);
    setRomSize(romList[index].kich_thuoc_rom); // Lấy kích thước ROM từ bảng
    setErrorMessage("");
  };

  // Render modal if open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h2>ROM</h2>
        <button className="close-btn" onClick={onClose}>
          <MdClose />
        </button>
        <div className="input-container">
          <label>Kích thước ROM</label>
          <input
            id="rom-size-input"
            type="text"
            placeholder="Nhập kích thước ROM"
            value={romSize || ""}
            onChange={(e) => setRomSize(e.target.value)}
          />
          {errorMessage && (
            <p className="error-message-brand">{errorMessage}</p>
          )}
        </div>

        <div className="brand-table-container">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Mã ROM</th>
                <th>Kích thước ROM</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {romList.map((rom, index) => (
                <tr key={rom.ma_rom} onClick={() => handleRomClick(index)}>
                  <td>{rom.ma_rom}</td>
                  <td>{rom.kich_thuoc_rom}</td>
                  <td>
                    <button
                      className="btn-delete-modal"
                      onClick={(e) => handleDeleteRom(index, e)}
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
          <button className="add-btn-modal" onClick={handleAddRom}>
            Thêm
          </button>

          <button className="edit-btn-modal" onClick={handleEditRom}>
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RomModal;
