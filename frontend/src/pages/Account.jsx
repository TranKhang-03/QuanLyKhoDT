import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaRedo } from "react-icons/fa";
import "../style/Account.css";
import axios from "axios";

const Account = () => {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [data, setData] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchedAccount, setSearchedAccount] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // Lưu giá trị từ input
  const [currentAccount, setCurrentAccount] = useState(null); 
  const [statusFilter, setStatusFilter] = useState('1');
  const [newAccountData, setNewAccountData] = useState({
    ma_nv: "",
    ten_nv: "",
    gioi_tinh: "",
    sdt: "",
    email: "",
    mat_khau: "",
    ma_quyen: "",
    trang_thai: 1,
  });

  const [editAccountData, setEditAccountData] = useState({
    ten_nv: "",
    gioi_tinh: "",
    sdt: "",
    email: "",
    mat_khau: ""
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/employee");
      const accounts = await response.json();
      setData(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

    // State để lưu tên quyền
    const [permissions, setPermissions] = useState({});
  
    // Hàm gọi API lấy tên quyền theo mã quyền
    const fetchPermissionName = async (ma_quyen) => {
      try {
        const response = await fetch(`http://localhost:5000/api/permission/layten/${ma_quyen}`);
        const data = await response.json();
        return data.ten_quyen;
      } catch (error) {
        console.error("Lỗi khi lấy tên quyền:", error);
        return null;
      }
    };
  
    useEffect(() => {
      // Lấy tên quyền cho mỗi tài khoản
      const getPermissions = async () => {
        let permissionsData = {};
        for (const account of data) {
          if (!permissionsData[account.ma_quyen]) {
            const permissionName = await fetchPermissionName(account.ma_quyen);
            permissionsData[account.ma_quyen] = permissionName;
          }
        }
        setPermissions(permissionsData);
      };
      
      getPermissions();
    }, [data]);

  const generateEmployeeId = () => {
    const maxId = data.reduce((max, account) => {
      const match = account.ma_nv.match(/^nv(\d+)$/);
      if (match) {
        const id = parseInt(match[1], 10);
        return Math.max(max, id);
      }
      return max;
    }, 0);
    return `nv${maxId + 1}`;
  };

  const handleAddAccount = async () => {
    // Kiểm tra xem dữ liệu đã đủ chưa
    if (
      !newAccountData.ten_nv ||
      !newAccountData.email ||
      !newAccountData.mat_khau ||
      !newAccountData.sdt ||
      !newAccountData.gioi_tinh ||
      !newAccountData.ma_quyen
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    const validationError = validateAccountData(newAccountData);
    if (validationError) {
      alert(validationError);
      return;
    }

    if (
      newAccountData.ma_quyen < 1 || // Kiểm tra nếu `ma_quyen` nhỏ hơn 1
      newAccountData.ma_quyen > 4 // Kiểm tra nếu `ma_quyen` lớn hơn 4
    ) {
      alert("Mã quyền phải nằm trong khoảng từ 1 đến 4 và không được để trống.");
      return;
    }
    
    try {
      const ma_nv = generateEmployeeId();
      const newAccountWithEmployeeId = {...newAccountData, ma_nv};
  
      const response = await fetch("http://localhost:5000/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccountWithEmployeeId),
      });
  
      // Kiểm tra xem phản hồi từ API có thành công không
      if (!response.ok) throw new Error("Failed to add account");
  
      const newAccount = await response.json();
  
      // Cập nhật danh sách dữ liệu và đóng form thêm tài khoản
      setData((prevData) => [...prevData, newAccount]);
      setShowAddAccount(false);
  
      // Reset lại dữ liệu sau khi thêm tài khoản thành công
      setNewAccountData({
        ma_nv: "",
        ten_nv: "",
        gioi_tinh: "",
        sdt: "",
        email: "",
        mat_khau: "",
        ma_quyen: "",
        trang_thai: 1,
      });
  
      alert("Tạo tài khoản thành công!");
      fetchAccounts();
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleEditAccount = async () => {
      const validationError = validateAccountData(editAccountData);
      if (validationError) {
        alert(validationError);
        return;
      }
      try {
        const response = await axios.put(
          `http://localhost:5000/api/employee/${currentAccount.ma_nv}`,
          editAccountData
        );
        setShowEditAccount(false);
        setCurrentAccount(null);
        alert("Thay đổi thành công!");
        fetchAccounts();
      } catch (error) {
        console.error("Error updating account:", error);
      }
  };

  const handleDeleteAccount = async (ma_nv) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc chắn muốn thay đổi trạng thái tài khoản với mã nhân viên ${ma_nv}?`
    );
  
    if (!confirmDelete) {
      return; // Dừng nếu người dùng không xác nhận
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/employee/${ma_nv}`,
        {
          method: "DELETE",
        }
      );
  
      if (response.ok) {
        alert("Xóa tài khoản thành công!");
        fetchAccounts(); // Cập nhật danh sách tài khoản
      } else {
        alert("Có lỗi xảy ra khi xóa tài khoản.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Không thể kết nối tới server. Vui lòng thử lại sau.");
    }
  };

  const handleShowAddAccount = () => {
    setShowAddAccount(!showAddAccount);
  };

  const handleShowEditAccount = (account) => {
    if (!account) {
      console.error("No account provided to edit");
      return;
    }
    setCurrentAccount(account);
    setEditAccountData({
      ten_nv: account.ten_nv || "",
      gioi_tinh: account.gioi_tinh || "",
      sdt: account.sdt || "",
      email: account.email || "",
      mat_khau: account.mat_khau || "",
      ma_quyen: account.ma_quyen || "",
      trang_thai: account.trang_thai || "",
    });
    setShowEditAccount(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (showAddAccount) {
      setNewAccountData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      return;
    }
  
    if (showEditAccount && currentAccount) {
      setEditAccountData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const validateAccountData = (data) => {
    const { ten_nv, email, mat_khau, sdt, gioi_tinh, ma_quyen } = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const validGenders = ["Nam", "Nữ"]; // Giới tính hợp lệ

    if (!ten_nv?.trim()) return "Tên nhân viên không được để trống.";
    if (!email || !emailRegex.test(email)) return "Email không hợp lệ.";
    if (!mat_khau?.trim()) return "Mật khẩu không được để trống.";
    if (mat_khau.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (!sdt || !phoneRegex.test(sdt)) return "Số điện thoại không hợp lệ.";
    if (!gioi_tinh?.trim() || !validGenders.includes(gioi_tinh))
      return "Giới tính không hợp lệ. Chỉ chấp nhận 'Nam' hoặc 'Nữ'.";
    if (!ma_quyen || isNaN(ma_quyen)) return "Mã quyền phải là số hợp lệ.";

    return null;
  };
  
  const handleSearchAccount = async (ma_nv) => {
    // Kiểm tra nếu ma_nv rỗng
    if (!ma_nv.trim()) {
      alert("Vui lòng nhập mã nhân viên.");
      return; // Dừng hàm nếu mã nhân viên rỗng
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/employee/${ma_nv}`);
      if (!response.ok) throw new Error("Không tìm thấy tài khoản");
  
      const result = await response.json();
  
      // Kiểm tra nếu kết quả tìm kiếm rỗng
      if (!result || Object.keys(result).length === 0) {
        throw new Error("Không tìm thấy tài khoản với mã nhân viên này.");
      }
  
      setSearchedAccount(result); // Gán kết quả tìm kiếm
      setShowSearchResult(true); // Hiển thị khung thông tin
    } catch (error) {
      console.error("Error fetching account:", error);
      alert(error.message); // Hiển thị thông báo lỗi từ error
      setShowSearchResult(false);
      setSearchedAccount(null);
    }
  };
  
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  

  return (
    <div>
      <div className="container-account">
        <h1>Quản Lí Tài Khoản</h1>
        <div className="container-account_content">
        <div className="search-acc-container">
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            className="search-acc-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)} // Cập nhật giá trị nhập
          />
          <button 
            className="search-acc-button" 
            onClick={() => handleSearchAccount(searchInput)} // Gọi hàm tìm kiếm
          >
            Tìm kiếm
          </button>
          <select 
            value={statusFilter} 
            onChange={handleStatusFilterChange}
            className="status-filter"
          >
            <option value="1">Hoạt động</option>
            <option value="0">Ngừng hoạt động</option>
          </select>
        </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Nhân Viên</th>
                <th>Giới Tính</th>
                <th>Số Điện Thoại</th>
                <th>Email</th>
                <th>Mật Khẩu</th>
                <th>Mã Quyền</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data
                  .filter(account => account.trang_thai.toString() === statusFilter)
                  .map((account) => (
                  <tr key={account.ma_nv}>
                    <td>{account.ma_nv}</td>
                    <td>{account.ten_nv}</td>
                    <td>{account.gioi_tinh}</td>
                    <td>{account.sdt}</td>
                    <td>{account.email}</td>
                    <td>{account.mat_khau}</td>
                    <td>{permissions[account.ma_quyen] || "Đang tải..."}</td>
                    <td>
                      {account.trang_thai ? "Hoạt động" : "Ngừng hoạt động"}
                    </td>
                    <td>
                    {account.trang_thai === 1 ? (
                      <>
                        <FaEdit
                          className="edit-acc"
                          onClick={() => handleShowEditAccount(account)}
                        />
                        <FaTrash
                          className="delete-acc"
                          onClick={() => handleDeleteAccount(account.ma_nv)}
                        />
                      </>
                    ) : (
                      <>
                        <FaRedo
                          className="delete-acc"
                          onClick={() => handleDeleteAccount(account.ma_nv)}
                        />
                      </>
                    )}
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {statusFilter === "1" && (
            <div className="add-account_button">
              <button onClick={handleShowAddAccount}>Thêm Tài Khoản</button>
            </div>
          )}
        </div>
      </div>

      {showAddAccount && (
        <div className="add-account">
          <div className="add-account_content">
          <h2 className="account_title">Thêm Tài Khoản</h2>
            {/* First Column */}
            <div className="add-account_content__column">
              <div className="add-account_content__content-items">
                <label htmlFor="ten_nv">Tên Nhân Viên</label>
                <input
                  type="text"
                  id="ten_nv"
                  name="ten_nv"
                  value={newAccountData.ten_nv}
                  onChange={handleInputChange}
                />
              </div>

              <div className="add-account_content__content-items">
                <label htmlFor="gioi_tinh">Giới Tính</label>
                <input
                  type="text"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  value={newAccountData.gioi_tinh}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Second Column */}
            <div className="add-account_content__column">
              <div className="add-account_content__content-items">
                <label htmlFor="sdt">Số Điện Thoại</label>
                <input
                  type="text"
                  id="sdt"
                  name="sdt"
                  value={newAccountData.sdt}
                  onChange={handleInputChange}
                />
              </div>

              <div className="add-account_content__content-items">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newAccountData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="add-account_content__content-items">
                <label htmlFor="mat_khau">Mật Khẩu</label>
                <input
                  type="password"
                  id="mat_khau"
                  name="mat_khau"
                  value={newAccountData.mat_khau}
                  onChange={handleInputChange}
                />
              </div>

              {/* Mã Quyền field moved below Mật Khẩu */}
              <div className="add-account_content__content-items">
                <label htmlFor="ma_quyen">Mã Quyền</label>
                <input
                  type="number"
                  id="ma_quyen"
                  name="ma_quyen"
                  value={newAccountData.ma_quyen}
                  onChange={handleInputChange}
                />
              </div>
              {/* Action Buttons */}
              <div className="add-account_buttons">
                <button onClick={handleAddAccount}>Thêm</button>
                <button onClick={() => setShowAddAccount(false)}>Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}

{showSearchResult && searchedAccount && (
  <div className="add-account">
    <div className="add-account_content">
      <h2 className="account_title">Thông Tin Tài Khoản Cần Tìm</h2>
      
      {/* First Column */}
      <div className="add-account_content__column">
        <div className="add-account_content__content-items">
          <label htmlFor="ten_nv">Tên Nhân Viên</label>
          <input
            type="text"
            id="ten_nv"
            name="ten_nv"
            value={searchedAccount.ten_nv}
            readOnly
          />
        </div>

        <div className="add-account_content__content-items">
          <label htmlFor="gioi_tinh">Giới Tính</label>
          <input
            type="text"
            id="gioi_tinh"
            name="gioi_tinh"
            value={searchedAccount.gioi_tinh}
            readOnly
          />
        </div>
      </div>

      {/* Second Column */}
      <div className="add-account_content__column">
        <div className="add-account_content__content-items">
          <label htmlFor="sdt">Số Điện Thoại</label>
          <input
            type="text"
            id="sdt"
            name="sdt"
            value={searchedAccount.sdt}
            readOnly
          />
        </div>

        <div className="add-account_content__content-items">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={searchedAccount.email}
            readOnly
          />
        </div>

        <div className="add-account_content__content-items">
          <label htmlFor="mat_khau">Mật Khẩu</label>
          <input
            type="text"
            id="mat_khau"
            name="mat_khau"
            value={searchedAccount.mat_khau}
            readOnly
          />
        </div>

        <div className="add-account_content__content-items">
          <label htmlFor="ma_quyen">Mã Quyền</label>
          <input
            type="number"
            id="ma_quyen"
            name="ma_quyen"
            value={searchedAccount.ma_quyen}
            readOnly
          />
        </div>

        <div className="add-account_buttons">
          <button onClick={() => setShowSearchResult(false)}>Hủy</button>
        </div>
        
        {/* Conditionally render based on trang_thai */}
        <div className="account-act">
          {searchedAccount.trang_thai === 1 ? (
            <>
              <FaEdit
                className="edit-acc"
                onClick={() => {
                  handleShowEditAccount(searchedAccount);
                  setShowSearchResult(false);  // Set to false when clicked
                }}
              />
              <FaTrash
                className="delete-acc"
                onClick={() => {
                  handleDeleteAccount(searchedAccount.ma_nv);
                  setShowSearchResult(false);  // Set to false when clicked
                }}
              />
            </>
          ) : searchedAccount.trang_thai === 0 ? (
            <FaRedo
              className="delete-acc"
              onClick={() => {
                handleDeleteAccount(searchedAccount.ma_nv);
                setShowSearchResult(false);  // Set to false when clicked
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  </div>
)}


      {showEditAccount && currentAccount && (
        <div className="edit-account">
          <div className="edit-account_content">
           <h2 className="account_title">Sửa Tài Khoản</h2>
            <div className="edit-account_content__column">
              <div className="edit-account_content__content-items">
                <label htmlFor="ten_nv">Tên Nhân Viên</label>
                <input
                  type="text"
                  id="ten_nv"
                  name="ten_nv"
                  value={editAccountData.ten_nv}
                  onChange={handleInputChange}
                />
              </div>

              <div className="edit-account_content__content-items">
                <label htmlFor="gioi_tinh">Giới Tính</label>
                <input
                  type="text"
                  id="gioi_tinh"
                  name="gioi_tinh"
                  value={editAccountData.gioi_tinh}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="edit-account_content__column">
              <div className="edit-account_content__content-items">
                <label htmlFor="sdt">Số Điện Thoại</label>
                <input
                  type="text"
                  id="sdt"
                  name="sdt"
                  value={editAccountData.sdt}
                  onChange={handleInputChange}
                />
              </div>

              <div className="edit-account_content__content-items">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editAccountData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="edit-account_content__content-items">
                <label htmlFor="mat_khau">Mật Khẩu</label>
                <input
                  type="text"
                  id="mat_khau"
                  name="mat_khau"
                  value={editAccountData.mat_khau}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="edit-account_buttons">
              <button onClick={handleEditAccount}>Cập Nhật</button>
              <button onClick={() => setShowEditAccount(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
