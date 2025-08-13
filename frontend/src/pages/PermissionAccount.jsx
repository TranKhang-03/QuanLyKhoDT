import React, { useEffect, useState, useMemo } from "react";
import "../style/PermissionAccount.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import permissionService from "../services/permissionService";
const PermissionAccount = () => {
  // const [showAddUserAccount, setShow] = useState(false);

  // const handleShowAddUserAccount = () => {
  //   setShow(!showAddUserAccount);
  // };

  const [showEditUserAccount, setShow2] = useState(false);
  const [name, setName] = useState({ ten_nv: "", email: "" });
  const [roleID, setRoleID] = useState({ ma_quyen: 0 });
  const [maNvID, setMaNvID] = useState("");
  const [nameRoleChange, setNameRoleChange] = useState("");
  const handleShowEditUserAccount = (ma_nv, ten_nv, email, ma_quyen) => {
    setShow2(!showEditUserAccount);
    setName({ ten_nv: ten_nv, email: email });
    setRoleID((prev) => ({ ...prev, ma_quyen: ma_quyen }));
    setMaNvID(ma_nv);
    setNameRoleChange(ma_quyen); // neu state la kieu chuoi khi set kieu so thi sau cung no van la chuoi
  };

  const handleRoleChange = (e) => {
    setRoleID((prev) => ({ ...prev, ma_quyen: parseInt(e.target.value) }));
    setNameRoleChange(e.target.value);
  };
  // kiem tra xem roleID co cap nhat sau khi thay doi option o the select khong
  // useEffect(() => {
  //   console.log("check role after change: ", roleID);
  // }, [roleID]);

  const [dataShow, setDataShow] = useState([]);
  useEffect(() => {
    const fetchPermission = async () => {
      const data = await permissionService.showAllPermission();
      console.log(data);
      setDataShow(data);
    };
    fetchPermission();
  }, []);

  const handleChangeRole = async (maNvID, roleID) => {
    if (roleID.ma_quyen === null || !roleID.ma_quyen) {
      alert("Chọn vai trò không được để trống");
      return;
    }
    try {
      console.log(roleID.ma_quyen);
      const response = await permissionService.updateRole(maNvID, roleID);
      console.log("updated role succcessfull", response);
      alert("Thay đổi thành công.");
      window.location.reload();
    } catch (error) {
      console.log("error updating role: ", error);
    }
  };

  const handleDeleteUserAccount = async (ma_nv, trang_thai) => {
    console.log(ma_nv);
    if (trang_thai === 0) {
      return;
    }
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn xóa vai trò của người dùng này không?"
    );
    if (!confirmDelete) return;
    try {
      const response = await permissionService.deleteRole(ma_nv);
      console.log("delete successfull", response);
      alert("Đã xóa thành công.", response);
      window.location.reload();
    } catch (error) {
      console.log("error deleting user account: ", error);
    }
  };

  const [showFeature, setShowFeature] = useState(false);
  const handleShowFeature = () => {
    setShowFeature(!showFeature);
  };

  const [dataFeature, setDataFeature] = useState([]);
  useEffect(() => {
    const fetchDataFeature = async () => {
      const data = await permissionService.showAllFeature();
      setDataFeature(data);
      console.log(data);
    };
    fetchDataFeature();
  }, []);

  const [optionPermission, setOptionPermission] = useState("");
  const [optionRoleID, setOptionRoleID] = useState(0);
  const handleShowFeatureFolowPermission = (e) => {
    setOptionPermission(e.target.value);
    if (e.target.value === "Admin") {
      setOptionRoleID(1);
    } else if (e.target.value === "Quản lý") {
      setOptionRoleID(2);
    } else if (e.target.value === "Nhân viên kho") {
      setOptionRoleID(3);
    } else if (e.target.value === "Nhân viên kiểm toán") {
      setOptionRoleID(4);
    } else {
      setOptionRoleID(0);
    }
  };
  const featureArray = useMemo(
    () => [
      "Quản lý sản phẩm",
      "Quản lý khu vực kho",
      // "Quản lý nhân viên",
      "Quản lý khách hàng",
      "Quản lý nhà cung cấp",
      // "Quản lý tài khoản",
      // "Quản lý nhóm quyền",
      "Quản lý thống kê",
      "Quản lý nhập hàng",
      "Quản lý xuất hàng",
      "Quản lý thuộc tính",
    ],
    []
  );
  const [checkedPermissions, setCheckedPermissions] = useState({});
  useEffect(() => {
    const initialChecked = {};
    const currentRole = dataFeature.find(
      (item) => item.ten_quyen === optionPermission
    );
    if (currentRole) {
      currentRole.FeaturePermissions.forEach((subItem) => {
        initialChecked[subItem.ten_chuc_nang] = true;
      });
    }
    featureArray.forEach((feature) => {
      initialChecked[feature] = initialChecked[feature] || false; // Nếu không có thì set là false
    });
    setCheckedPermissions(initialChecked);
  }, [dataFeature, optionPermission, featureArray]);
  // const handleCheckboxChange = (tenChucNang) => {
  //   setCheckedPermissions((prev) => ({
  //     ...prev,
  //     [tenChucNang]: !prev[tenChucNang], // Đảo ngược trạng thái checkbox
  //   }));
  // };
  const handleCheckboxChange = (tenChucNang) => {
    setCheckedPermissions((prev) => {
      const newChecked = {
        ...prev,
        [tenChucNang]: !prev[tenChucNang],
      };
      // Gọi hàm để lấy tên chức năng đã chọn
      handleSelectedFeatures(newChecked);
      return newChecked;
    });
  };
  const [seletedFeature, setSelectedFeature] = useState({ listFeature: [] });
  const handleSelectedFeatures = (permissions) => {
    const selectedFeatures = Object.keys(permissions).filter(
      (feature) => permissions[feature]
    );
    console.log("Tên chức năng đã chọn:", selectedFeatures);
    const updatedSeletedFeature = selectedFeatures.map((item) => {
      return item === "Quản lý sản phẩm"
        ? 1
        : item === "Quản lý khu vực kho"
        ? 2
        : item === "Quản lý nhân viên"
        ? 3
        : item === "Quản lý khách hàng"
        ? 4
        : item === "Quản lý nhà cung cấp"
        ? 5
        : item === "Quản lý tài khoản"
        ? 6
        : item === "Quản lý nhóm quyền"
        ? 7
        : item === "Quản lý thống kê"
        ? 8
        : item === "Quản lý nhập hàng"
        ? 9
        : item === "Quản lý xuất hàng"
        ? 10
        : item === "Quản lý thuộc tính"
        ? 11
        : null;
    });
    setSelectedFeature({ listFeature: updatedSeletedFeature });
  };
  useEffect(() => {
    console.log("array:", seletedFeature);
  }, [seletedFeature]);

  const handleChangeFeature = async () => {
    if (optionRoleID === 0 || seletedFeature.listFeature.length === 0) {
      return;
    }
    try {
      const response = await permissionService.changeRole(
        optionRoleID,
        seletedFeature
      );
      alert("Thay đổi thành công.");
      window.location.reload();
      console.log("Change feature successfull", response);
    } catch (error) {
      console.log("Error change feature:", error);
    }
  };

  return (
    <div>
      <div class="permission-container-account">
        <h1>Quản Lí Người Dùng</h1>
        <div class="permission-container-account_content">
          <table>
            <tr>
              <td>Tên Tài Khoản</td>
              <td>Email</td>
              <td>Vai Trò</td>
              <td>Thao Tác</td>
            </tr>
            {dataShow.length > 0 ? (
              dataShow.map((item) => (
                <tr>
                  <td>{item.ten_nv}</td>
                  <td>{item.email}</td>
                  {/* <td>{item.ten_quyen ? item.ten_quyen : "No Permission"}</td> */}
                  <td>
                    {item.trang_thai === 1 ? item.ten_quyen : <b>INVALID</b>}
                  </td>
                  <td>
                    {item.ten_quyen !== "Admin" ? (
                      <>
                        <FaEdit
                          className="edit-btn"
                          onClick={() =>
                            handleShowEditUserAccount(
                              item.ma_nv,
                              item.ten_nv,
                              item.email,
                              item.ma_quyen
                            )
                          }
                        />
                        <FaTrash
                          className="delete-btn"
                          onClick={() =>
                            handleDeleteUserAccount(item.ma_nv, item.trang_thai)
                          }
                        />{" "}
                      </>
                    ) : null}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No Data</td>
              </tr>
            )}
          </table>
          {/* <div class="container-account_button">
            <button onClick={handleShowAddUserAccount}>Thêm</button>
          </div> */}
        </div>
      </div>

      {/* <div
        className="add-user-account"
        style={{ display: showAddUserAccount ? "block" : "none" }}
      >
        <h1>Thêm Người Dùng</h1>
        <div className="add-user-account_content">
          <div className="add-user-account_content__content-items">
            <label htmlFor="">Tên Tài Khoản:</label>
            <input type="text" placeholder="Nhập tên tài khoản" />
          </div>
          <div className="add-user-account_content__content-items">
            <label htmlFor="">Email:</label>
            <input type="text" placeholder="Nhập email" />
          </div>
          <div className="add-user-account_content__content-items">
            <label htmlFor="">Chọn vai trò:</label>
            <select name="ten_quyen">
              <option value="Admin">Admin</option>
              <option value="nhân viên quản lí kho">
                nhân viên quản lí kho
              </option>
              <option value="kế toán">kế toán</option>
            </select>
          </div>
          <div className="add-user-account_button">
            <button>Lưu</button>
            <button onClick={handleShowAddUserAccount}>Thoát</button>
          </div>
        </div>
      </div> */}

      <div
        className="permission-edit-user-account"
        style={{ display: showEditUserAccount ? "block" : "none" }}
      >
        <div className="wrapper-content">
          <h1>Sửa Vai Trò Người Dùng</h1>
          <div className="permission-edit-user-account_content">
            <div className="permission-edit-user-account_content__content-items">
              <label htmlFor="">Tên Tài Khoản:</label>
              <input
                type="text"
                placeholder="Nhập tên tài khoản"
                value={name.ten_nv}
                readOnly
              />
            </div>
            <div className="permission-edit-user-account_content__content-items">
              <label htmlFor="">Email:</label>
              <input
                type="text"
                placeholder="Nhập email"
                value={name.email}
                readOnly
              />
            </div>
            <div className="permission-edit-user-account_content__content-items">
              <label htmlFor="">Chọn vai trò:</label>
              <select value={nameRoleChange} onChange={handleRoleChange}>
                <option></option>
                {/* <option value="1">Admin</option> */}
                <option value="2">Quản lý</option>
                <option value="3">Nhân viên kho</option>
                <option value="4">Nhân viên kiểm toán</option>
              </select>
              {console.log("check before:", nameRoleChange)}
              {console.log("check before:", roleID.ma_quyen)}
            </div>
            <div className="permission-edit-user-account_button">
              <button onClick={() => handleChangeRole(maNvID, roleID)}>
                Lưu
              </button>
              <button onClick={handleShowEditUserAccount}>Thoát</button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrapper-btn">
        <button className="show-feature-btn" onClick={handleShowFeature}>
          Thay Đổi Chức Năng Quyền
        </button>
      </div>

      <div
        className="feature-permission"
        style={{ display: showFeature ? "block" : "none" }}
      >
        <div className="feature-permission_content">
          <table>
            <tr>
              <td>Vai Trò</td>
              <td>Chức Năng</td>
              <td>Lựa Chọn</td>
            </tr>
            <tr>
              <td>
                <select
                  onChange={handleShowFeatureFolowPermission}
                  value={optionPermission}
                >
                  <option value="">----- Chọn quyền -----</option>
                  <option value="Admin">Admin</option>
                  <option value="Quản lý">Quản lý</option>
                  <option value="Nhân viên kho">Nhân viên kho</option>
                  <option value="Nhân viên kiểm toán">
                    Nhân viên kiểm toán
                  </option>
                </select>
              </td>
              <td>---------------------</td>
              <td>---------------------</td>
            </tr>
            {/* {dataFeature.map((item) =>
              optionPermission === item.ten_quyen
                ? item.FeaturePermissions.map((subItem) => (
                    <tr>
                      <td></td>
                      <td>{subItem.ten_chuc_nang}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={
                            checkedPermissions[subItem.ten_chuc_nang] || false
                          }
                          onChange={() =>
                            handleCheckboxChange(subItem.ten_chuc_nang)
                          }
                        />
                      </td>
                    </tr>
                  ))
                : null
            )} */}
            {optionPermission
              ? featureArray.map((feature) => (
                  <tr key={feature}>
                    <td></td>
                    <td>{feature}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedPermissions[feature] || false}
                        onChange={() => handleCheckboxChange(feature)}
                      />
                    </td>
                  </tr>
                ))
              : null}
          </table>
          <div className="save-show-feature">
            <button onClick={handleChangeFeature}>Lưu</button>
            <button onClick={handleShowFeature}>Thoát</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PermissionAccount;
