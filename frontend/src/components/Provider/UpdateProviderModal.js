import React, { useState } from "react";

import axios from "axios";

const UpdateProviderModal = ({
  formData,
  setSuccessMessage,
  hiddenEdit,
  fetchProviders,
  showEditCustomer,
  handleInputChange,
  errorInput,
  setErrorInput,
  setSearch,
  toast
}) => {

  //cập nhật Nhà cung cấp
  const updateProvider = async () => {
    if (!formData.TNCC || !formData.DC || !formData.Email || !formData.SDT) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      if (!formData.TNCC) {
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
      if (!formData.Email) {
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[2] = true;
          return newErrors;
        });
      }
      if (!formData.SDT) {
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[3] = true;
          return newErrors;
        });
      }
    } else {
      if (!validateEmail(formData.Email)) {
        toast.error("Vui lòng nhập đúng Email!");
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[2] = true;
          return newErrors;
        });
      } else {
        if (!validatePhoneNumber(formData.SDT)) {
          toast.error("Vui lòng nhập đúng SDT!");
          setErrorInput((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[3] = true;
            return newErrors;
          });
        } else {
          const payload = {
            ten_ncc: formData.TNCC,
            dia_chi: formData.DC,
            email_ncc: formData.Email,
            sdt_ncc: formData.SDT,
          };
          await axios.put(
            `http://localhost:5000/api/providers/${formData.MNCC}`,
            payload
          );
          toast.success("Sửa thành công");;
          hiddenEdit("");
          fetchProviders();
          setErrorInput((prevErrors) => {
            const newErrors = prevErrors.map(() => false);
            return newErrors;
          });
          setSearch({ MNCC: "" });
        }
      }
    }
  };

  // Hàm kiểm tra Email
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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
      <div class="overlay " onClick={() => hiddenEdit(" ")}></div>
      <div class="form_interface">
        <form class="form_interface_add">
          <div>
            <h1>Sửa Khách Hàng</h1>

            <div class="interface_add-content">
              <input
                placeholder="Nhập Tên Nhà Cung Cấp"
                name="TNCC"
                type="text"
                value={formData.TNCC}
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
                placeholder="nhập Email"
                name="Email"
                type="text"
                value={formData.Email}
                onChange={handleInputChange}
                className={errorInput[2] ? "error-input" : ""}
                onClick={() => handleInputClick(2)}
              ></input>
              <input
                placeholder="Nhập Số điện thoại"
                name="SDT"
                type="text"
                value={formData.SDT}
                onChange={handleInputChange}
                className={errorInput[3] ? "error-input" : ""}
                onClick={() => handleInputClick(3)}
              ></input>
            </div>

            <div class="button-addCustomer-interface">
              <button type="button" onClick={() => hiddenEdit(" ")}>
                Thoát
              </button>
              <button type="button" onClick={updateProvider}>
                Sửa
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UpdateProviderModal;
