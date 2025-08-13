import React, { useState } from "react";

import axios from "axios";

const AddProviderModal = ({
  formData,
  hiddenAdd,
  showAdd,
  handleInputChange,
  fetchProviders,
  errorInput,
  setErrorInput,
  setSearch,
  toast
}) => {

  //Thêm Nhà Cung Cấp
  const addProvider = async () => {
    if (
      !formData.MNCC ||
      !formData.TNCC ||
      !formData.DC ||
      !formData.Email ||
      !formData.SDT
    ) {
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
      if (!validatePhoneNumber(formData.SDT)) {
        toast.error("Vui lòng nhập đúng SDT!");
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[3] = true;
          return newErrors;
        });
      } else {
        if (!validateEmail(formData.Email)) {
          toast.error("Vui lòng nhập đúng Email!");
          setErrorInput((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[2] = true;
            return newErrors;
          });
        } else {
          try {
            const payload = {
              ma_ncc: formData.MNCC,
              ten_ncc: formData.TNCC,
              dia_chi: formData.DC,
              email_ncc: formData.Email,
              sdt_ncc: formData.SDT,
            };
            await axios.post("http://localhost:5000/api/providers", payload);
            toast.success("Thêm thành công");
            fetchProviders();
            hiddenAdd();
            setErrorInput((prevErrors) => {
              const newErrors = prevErrors.map(() => false);
              return newErrors;
            });
            setSearch({ MNCC: "" });
          } catch (error) {
            toast.error("Mã Nhà Cung Cấp bị Trùng!");
          }
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
    <div class="interface_add" style={{ display: showAdd ? "block" : "none" }}>
      <div class="overlay " onClick={hiddenAdd}></div>
      <div class="form_interface">
        <form class="form_interface_add">
          <div>
            <h1> Thêm Khách Hàng</h1>
            <div class="interface_add-content">
              <input
                placeholder="Nhập Mã Nhà Cung Cấp"
                name="MNCC"
                type="number"
                readOnly
                className="inputshow_notcomment"
                value={formData.MNCC}
                onChange={handleInputChange}
              ></input>
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
                placeholder="Nhập Email"
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
              <button type="button" onClick={hiddenAdd}>
                Thoát
              </button>
              <button type="button" onClick={addProvider}>
                Thêm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProviderModal;
