import React, { useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";

const UpdateCustomerModal = ({
  showEditCustomer,
  setShow1,
  hiddenEdit,
  formData,
  handleInputChange,
  setData,
  setCustomerIds,
  errorInput,
  setErrorInput,
  setSearch,
  toast
}) => {

  const fetchCustomers = async () => {
    try {
      // Gửi yêu cầu GET đến API để lấy danh sách khách hàng
      const response = await axios.get("http://localhost:5000/api/customers");

      // Cập nhật state customers với dữ liệu trả về
      setData(response.data.filter((item) => item.trang_thai == 1));
      // Cập nhật state customerIDs với dữ liệu trả về
      setCustomerIds(response.data.map((item) => item.ma_kh));
    } catch (err) {
      // Nếu có lỗi, set error
      console.error("Lỗi khi lấy dữ liệu");
      setData();
    }
    // Sau khi lấy xong dữ liệu, cập nhật trạng thái loading
  };

  const updateData = async () => {
    if (!formData.TKH || !formData.DC || !formData.SDT) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      if (!formData.TKH) {
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[0] = true;
          return newErrors;
        });
      }
      if (!formData.DC) {
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[1] = true;
          return newErrors;
        });
      }
      if (!formData.SDT) {
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[2] = true;
          return newErrors;
        });
      }
    } else {
      if (!validatePhoneNumber(formData.SDT)) {
        toast.error("Vui lòng nhập đúng SDT!");
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[2] = true;
          return newErrors;
        });
      } else {
        toast.success("Sửa thành công!");
        const payload = {
          ten_kh: formData.TKH,
          dia_chi_kh: formData.DC,
          sdt_kh: formData.SDT,
        };
        await axios.put(
          `http://localhost:5000/api/customers/${formData.MKH}`,
          payload
        );
        fetchCustomers();
        setShow1(!showEditCustomer);
        setErrorInput((prevErrors) => {
          const newErrors = prevErrors.map(() => false);
          return newErrors;
        });
        setSearch({MKH : ""})
      }
    }
  };

  // Hàm kiểm tra số điện thoại
  const validatePhoneNumber = (phone) => {
    const regex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/; // Định dạng hợp lệ hơn
    // Định dạng cho số điện thoại Việt Nam
    return regex.test(phone);
  };

  const handleInputClick = (index) => {
    setErrorInput((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = false; // Đặt lại lỗi cho input tại index
      return newErrors;
    });
  };

  return (
    <div
      class="interface_edit"
      style={{ display: showEditCustomer ? "block" : "none" }}
    >
      <div class="overlay " onClick={() => hiddenEdit()}></div>
      <div class="form_interface">
        <form class="form_interface_add">
          <div>
            <h1>Sửa Khách Hàng</h1>

            <div class="interface_add-content">
              <input
                placeholder="Nhập Tên"
                name="TKH"
                type="text"
                value={formData.TKH}
                onChange={handleInputChange}
                className={errorInput[0] ? "error-input" : ""}
                onClick={() => handleInputClick(0)}
              ></input>
              <input
                placeholder="nhập Địa chỉ"
                name="DC"
                type="text"
                value={formData.DC}
                onChange={handleInputChange}
                className={errorInput[1] ? "error-input" : ""}
                onClick={() => handleInputClick(1)}
              ></input>
              <input
                placeholder="Nhập Số điện thoại"
                name="SDT"
                type="text"
                value={formData.SDT}
                onChange={handleInputChange}
                className={errorInput[2] ? "error-input" : ""}
                onClick={() => handleInputClick(2)}
              ></input>
            </div>

            <div class="button-addCustomer-interface">
              <button type="button" onClick={() => hiddenEdit()}>
                Thoát
              </button>
              <button type="button" onClick={updateData}>
                Sửa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateCustomerModal;
