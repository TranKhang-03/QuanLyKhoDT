import React, { useState } from "react";
import { FaAndroid } from "react-icons/fa";
import { GiFactory } from "react-icons/gi";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { IoIosColorFilter } from "react-icons/io";
import { BsMemory } from "react-icons/bs";
import { IoHardwareChipOutline } from "react-icons/io5";
import BrandModal from "../components/Atrribute/BrandModal"; // Nhập BrandModal
import OriginModal from "../components/Atrribute/OriginModal";
import OSModal from "../components/Atrribute/OSModal";
import RamModal from "../components/Atrribute/RamModal";
import RomModal from "../components/Atrribute/RomModal";
import ColorModal from "../components/Atrribute/ColorModal";
import "../style/Attribute.css";

const Attribute = () => {
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="attribute-container">
      <div className="attribute-item" onClick={() => openModal("brand")}>
        <MdOutlineBrandingWatermark
          style={{ color: "#f39c12", fontSize: "3.5em" }}
        />
        <p>Thương hiệu</p>
      </div>
      <div className="attribute-item" onClick={() => openModal("origin")}>
        <GiFactory style={{ color: "#e74c3c", fontSize: "3.5em" }} />
        <p>Xuất xứ</p>
      </div>
      <div className="attribute-item" onClick={() => openModal("os")}>
        <FaAndroid style={{ color: "#27ae60", fontSize: "3.5em" }} />
        <p>Hệ điều hành</p>
      </div>
      <div className="attribute-item" onClick={() => openModal("ram")}>
        <BsMemory style={{ color: "#3498db", fontSize: "3.5em" }} />
        <p>Ram</p>
      </div>
      <div className="attribute-item" onClick={() => openModal("rom")}>
        <IoHardwareChipOutline
          style={{ color: "#95a5a6", fontSize: "3.5em" }}
        />
        <p>Rom</p>
      </div>
      <div className="attribute-item" onClick={() => openModal("color")}>
        <IoIosColorFilter style={{ color: "#e67e22", fontSize: "3.5em" }} />
        <p>Màu sắc</p>
      </div>

      {/* Hiển thị modal dựa trên loại modalType */}
      {modalType === "brand" && (
        <BrandModal isOpen={true} onClose={closeModal} />
      )}
      {modalType === "origin" && (
        <OriginModal isOpen={true} onClose={closeModal} />
      )}
      {modalType === "os" && <OSModal isOpen={true} onClose={closeModal} />}
      {modalType === "ram" && <RamModal isOpen={true} onClose={closeModal} />}
      {modalType === "rom" && <RomModal isOpen={true} onClose={closeModal} />}
      {modalType === "color" && (
        <ColorModal isOpen={true} onClose={closeModal} />
      )}
    </div>
  );
};

export default Attribute;
