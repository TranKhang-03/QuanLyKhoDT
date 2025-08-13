import React, { useState, useEffect } from "react";
import "../style/Employee.css";
import Cookies from "js-cookie";

const Employee = () => {
  const [employeeData, setEmployeeData] = useState({});
  const [permissionName, setPermissionName] = useState("");
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // Trạng thái hiển thị mật khẩu mới
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái hiển thị mật khẩu xác nhận
  const manv = localStorage.getItem("ma_nv");
  const [editAccountData, setEditAccountData] = useState({
    mat_khau: "",
  });

  const handleBackToLogin = () => {
    const confirmLogout = window.confirm("Xác nhận đăng xuất?");
    if (!confirmLogout) return;
    Cookies.remove("token");
    localStorage.removeItem('queueDataN')
    localStorage.removeItem('queueDataX')
    window.location.reload();

  };

  useEffect(() => {
    if (manv) {
      fetch(`http://localhost:5000/api/employee/${manv}`)
        .then((response) => response.json())
        .then((data) => {
          setEmployeeData(data);
          fetch(`http://localhost:5000/api/permission/layten/${data.ma_quyen}`)
            .then((response) => response.json())
            .then((permissionData) => {
              setPermissionName(permissionData.ten_quyen);
            })
            .catch((error) =>
              console.error("Error fetching permission name:", error)
            );
        })
        .catch((error) =>
          console.error("Error fetching employee data:", error)
        );
    }
  }, [manv]);

  const handlePasswordChange = async () => {
    if (!newPassword?.trim()){
      alert("Muốn đổi thì mật khẩu không được để trống.");
      return;
    }
    if (newPassword.length < 6){
      alert("Mật khẩu mới phải dài hơn 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (newPassword === employeeData.mat_khau) {
      alert("Mật khẩu mới không được trùng với mật khẩu cũ.");
      return;
    }

    const updatedAccountData = { ...editAccountData, mat_khau: newPassword };

    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/${manv}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAccountData),
        }
      );
      setEmployeeData((prevData) => ({
        ...prevData,
        mat_khau: newPassword,
      }));

      setShowPasswordChange(false);
      alert("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="employee-container">
      <h2>Thông Tin Nhân Viên</h2>
      <div className="employee-info">
        {/* Thông tin nhân viên */}
        <div className="em-info-item">
          <strong>Mã Nhân Viên:</strong> <span>{employeeData.ma_nv}</span>
        </div>
        <div className="em-info-item">
          <strong>Tên Nhân Viên:</strong> <span>{employeeData.ten_nv}</span>
        </div>
        <div className="em-info-item">
          <strong>Giới Tính:</strong> <span>{employeeData.gioi_tinh}</span>
        </div>
        <div className="em-info-item">
          <strong>Số Điện Thoại:</strong> <span>{employeeData.sdt}</span>
        </div>
        <div className="em-info-item">
          <strong>Email:</strong> <span>{employeeData.email}</span>
        </div>
        <div className="em-info-item">
          <strong>Tên Quyền:</strong>{" "}
          <span>{permissionName || employeeData.ma_quyen}</span>
        </div>
        <div className="em-info-item">
          <strong>Trạng Thái:</strong>{" "}
          <span>
            {employeeData.trang_thai === 1 ? "Kích hoạt" : "Không kích hoạt"}
          </span>
        </div>
        <button onClick={() => setShowPasswordChange(!showPasswordChange)}>
          Đổi Mật Khẩu
        </button>
        <button onClick={handleBackToLogin}>LOGOUT</button>
      </div>

      {showPasswordChange && (
        <div className="em-password-change">
          <h3>Đổi Mật Khẩu</h3>
          <div className="password-input">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <div className="password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>

          <button onClick={handlePasswordChange}>Lưu</button>
          <button onClick={() => setShowPasswordChange(false)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default Employee;
