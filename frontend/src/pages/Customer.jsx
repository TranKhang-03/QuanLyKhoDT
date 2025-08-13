import React, { useState, useEffect } from "react";
import "../style/Customer.css";
import { FaEdit, FaEye ,FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import AddCustomerModal from "../components/Customer/AddCustomerModal";
import UpdateCustomerModal from "../components/Customer/UpdateCustomerModal";
import AYSCustomerModal from "../components/Customer/AYSCustomerModal";
import SearchCustomerModal from "../components/Customer/SearchCustomerModal";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
const Customer = () => {
  const [Data, setData] = useState([]);
  const [showAddCustomer, setShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showEditCustomer, setShow1] = useState(false);
  const [showAYS, setAYS] = useState(false);
  const [customerIds, setCustomerIds] = useState([]);
  const [formData, setform] = useState({
    MKH: "",
    TKH: "",
    DC: "",
    SDT: "",
  });
  const [customerHidden, setCustomerHidden] = useState([]);
  const [search, setSearch] = useState({
    MKH: "",
  });
  const [errorInput, setErrorInput] = useState([false], [false], [false]);
  const [active, setActive] = useState(true);
  const fetchCustomers = async () => {
    try {
      // Gửi yêu cầu GET đến API để lấy danh sách khách hàng
      const response = await axios.get("http://localhost:5000/api/customers");

      // Cập nhật state customers với dữ liệu trả về
      setData(response.data.filter((item) => item.trang_thai === 1));
      // Cập nhật state customerIDs với dữ liệu trả về
      setCustomerIds(response.data.map((item) => item.ma_kh));
      // Cập nhật state customers bị ẩn
      setCustomerHidden(response.data.filter((item) => item.trang_thai === 0));
    } catch  {
      // Nếu có lỗi, set error
      console.error("Lỗi khi lấy dữ liệu");
      setData();
    }
    // Sau khi lấy xong dữ liệu, cập nhật trạng thái loading
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  const hiddenAdd = () => {
    setShow(!showAddCustomer);
    setform({
      MKH: generateNewCustomerId(),
      TKH: "",
      DC: "",
      SDT: "",
    });
    setErrorInput((prevErrors) => {
      const newErrors = prevErrors.map(() => false);
      return newErrors;
    });
  };

  const generateNewCustomerId = () => {
    if (customerIds.length === 0) return 1; // Nếu chưa có ID, bắt đầu từ KH1
    const lastId = customerIds[customerIds.length - 1]; // Lấy ID cuối cùng
    return `${lastId + 1}`; // Tăng giá trị số và thêm tiền tố
  };

  const handleEdit = (item) => {
    setShow1(!showEditCustomer);
    setform({
      MKH: item.ma_kh,
      TKH: item.ten_kh,
      DC: item.dia_chi_kh,
      SDT: item.sdt_kh,
    });
  };

  const hiddenEdit = () => {
    setShow1(!showEditCustomer);
    setform({
      MKH: "",
      TKH: "",
      DC: "",
      SDT: "",
    });
    setErrorInput((prevErrors) => {
      const newErrors = prevErrors.map(() => false);
      return newErrors;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setform({
      ...formData,
      [name]: value,
    });
  };

  const handleAYS = (MKH) => {
    setAYS(!showAYS);
    setform({
      MKH: MKH,
      TKH: "",
      DC: "",
      SDT: "",
    });
  };

  const handleActive = () => {
    setActive(!active);
    setSearch({MKH : ""})
    fetchCustomers()
  };

  return (
    <div class="page_customer">
      <div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>

      <div>
        <h1>Quản Lý Khách Hàng</h1>
      </div>
      <div class="operation">
        {/* form search */}
        <SearchCustomerModal
          setSearch={setSearch}
          setData={setData}
          search={search}
          active={active}
          setCustomerHidden={setCustomerHidden}
        />
        <div style={{ display: active ? "block" : "none" }}>
        <div class="button-addCustomer">
          <button onClick={hiddenAdd}>Thêm</button>
        </div>
        </div>
      </div>

      <div class="operation_KH">
        <button
          className={`button_KH ${active ? "active" : ""}`}
          onClick={handleActive}
        >
          Danh sách Khách hàng
        </button>
        <button
          className={`button_KH ${!active ? "active" : ""}`}
          onClick={handleActive}
        >
          Danh sách Khách hàng bị ẩn
        </button>
      </div>

      {/* form Thêm */}
      <AddCustomerModal
        hiddenAdd={hiddenAdd}
        showAddCustomer={showAddCustomer}
        formData={formData}
        handleInputChange={handleInputChange}
        setData={setData}
        setCustomerIds={setCustomerIds}
        errorInput={errorInput}
        setErrorInput={setErrorInput}
        setSearch={setSearch}
        toast={toast}
      />

      {/* form Sửa */}
      <UpdateCustomerModal
        showEditCustomer={showEditCustomer}
        setShow1={setShow1}
        hiddenEdit={hiddenEdit}
        formData={formData}
        handleInputChange={handleInputChange}
        setData={setData}
        setCustomerIds={setCustomerIds}
        errorInput={errorInput}
        setErrorInput={setErrorInput}
        setSearch={setSearch}
        toast={toast}
      />

      {/* form are you sure */}
      <AYSCustomerModal
        showAYS={showAYS}
        handleAYS={handleAYS}
        formData={formData}
        setSuccessMessage={setSuccessMessage}
        fetchCustomers={fetchCustomers}
        setAYS={setAYS}
        setSearch={setSearch}
        setform={setform}
        active={active}
        toast={toast}
      />

      {/* form contend */}
      <div class="content_customer">
        <div style={{ display: active ? "block" : "none" }}>
          <table>
            <thead>
              <tr class="QH">
                <td>Mã khách hàng</td>
                <td>Tên khách hàng</td>
                <td>Địa chỉ</td>
                <td>Số điện thoại</td>
                <td>Thao Tác</td>
              </tr>
              {Data.map((item, index) => (
                <tr key={index}>
                  <td>{item.ma_kh}</td>
                  <td>{item.ten_kh}</td>
                  <td>{item.dia_chi_kh}</td>
                  <td>{item.sdt_kh}</td>
                  <td>
                    <FaEdit onClick={() => handleEdit(item)}></FaEdit>
                    <FaEye onClick={() => handleAYS(item.ma_kh)}></FaEye>
                  </td>
                </tr>
              ))}
            </thead>
          </table>
        </div>

        <div style={{ display: !active ? "block" : "none" }}>
          <table>
            <thead>
              <tr class="QH">
                <td>Mã khách hàng</td>
                <td>Tên khách hàng</td>
                <td>Địa chỉ</td>
                <td>Số điện thoại</td>
                <td>Thao Tác</td>
              </tr>
              {customerHidden.map((item, index) => (
                <tr key={index}>
                  <td>{item.ma_kh}</td>
                  <td>{item.ten_kh}</td>
                  <td>{item.dia_chi_kh}</td>
                  <td>{item.sdt_kh}</td>
                  <td>
                    <FaEyeSlash onClick={() => handleAYS(item.ma_kh)}></FaEyeSlash>
                  </td>
                </tr>
              ))}
            </thead>
          </table>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000} // Tự động đóng sau 5 giây
        hideProgressBar={true} // Ẩn thanh tiến trình
        newestOnTop={true} // Hiển thị thông báo mới nhất trên cùng
        closeButton={false} // Tắt nút đóng
      />
    </div>
  );
};
export default Customer;
