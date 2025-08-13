import React, { useState } from "react";

import axios from "axios";

const AddCustomerModal = ({
  hiddenAdd,
  showAddCustomer,
  formData,
  handleInputChange,
  setData,
  setCustomerIds,
  errorInput,
  setErrorInput,
  setSearch,
  toast
}) => {
  const [showError, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      // Gửi yêu cầu GET đến API để lấy danh sách khách hàng
      const response = await axios.get("http://localhost:5000/api/customers");

      // Cập nhật state customers với dữ liệu trả về
      setData(response.data.filter((item) => item.trang_thai === 1));
      // Cập nhật state customerIDs với dữ liệu trả về
      setCustomerIds(response.data.map((item) => item.ma_kh));
    } catch (err) {
      // Nếu có lỗi, set error
      console.error("Lỗi khi lấy dữ liệu");
      setData();
    }
    // Sau khi lấy xong dữ liệu, cập nhật trạng thái loading
  };

  const addData = async () => {
    const payload = {
      ma_kh: formData.MKH,
      ten_kh: formData.TKH,
      dia_chi_kh: formData.DC,
      sdt_kh: formData.SDT,
    };
    if (!formData.TKH || !formData.DC || !formData.SDT) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      setTimeout(() => {
        setError("");
      }, 2000);
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
        setErrorInput((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[2] = true;
          return newErrors;
        });
        toast.error("Vui lòng nhâp đúng SDT!");
      } else {
        try {
          await axios.post("http://localhost:5000/api/customers", payload);

          toast.success("Thêm thành công!");
          // Cập nhật lại danh sách khách hàng
          fetchCustomers();
          hiddenAdd();
          setErrorInput((prevErrors) => {
            const newErrors = prevErrors.map(() => false);
            return newErrors;
          });
          setSearch({MKH : ""})
        } catch (error) {
          setError("Loi trung ma khach hang");
          setTimeout(() => {
            setError(""); // Ẩn thông báo
          }, 2000);
        }
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
      class="interface_add"
      style={{ display: showAddCustomer ? "block" : "none" }}
    >
      <div>
        <div class="overlay " onClick={hiddenAdd}></div>
        {/* Thông báo với animation */}
        {showError && <div className="error-message">{showError}</div>}
      </div>
      <div class="form_interface">
        <form class="form_interface_add">
          <div>
            <h1> Thêm Khách Hàng</h1>
            <div class="interface_add-content">
              <input
                placeholder="Nhập Mã Khách Hàng"
                name="MKH"
                readOnly
                type="number"
                className="inputshow_notcomment"
                value={formData.MKH}
                onChange={handleInputChange}
              ></input>
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
              <button type="button" onClick={hiddenAdd}>
                Thoát
              </button>
              <button type="button" onClick={addData}>
                Thêm
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddCustomerModal;
