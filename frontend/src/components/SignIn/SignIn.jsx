// import React, { useState, useEffect } from "react";
// import "./SignIn.css";
// import Cookies from "js-cookie";
// import loginService from "../../services/loginService";
// const SignIn = () => {
//   const [account, setAccount] = useState({ username: "", password: "" });
//   const [submitLanDauKhongCho, setSubmitLanDauKhongCho] = useState(true);
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAccount((prev) => ({ ...prev, [name]: value.trim() }));
//     setSubmitLanDauKhongCho(false);
//   };
//   useEffect(() => {
//     console.log(account);
//   }, [account]);
//   const username = document.querySelector(".username");
//   const password = document.querySelector(".password");
//   const smallUsername = document.querySelector(".smallUsername");
//   const smallPassword = document.querySelector(".smallPassword");
//   const handleShow = async () => {
//     try {
//       const response = await loginService.compareAccount(account);
//       if (response) {
//         Cookies.set("token", "nothing");
//         alert(`CHÀO MỪNG "${response.ten_nv}" ĐÃ ĐĂNG NHẬP THÀNH CÔNG`);
//         window.location.href = "/";
//         console.log("thanh cong", response);
//       } else {
//         alert("TAI KHOAN KHONG HOP LE");
//         const getUsername = await loginService.checkUsername(account);
//         if (!username.value && !password.value) {
//           username.classList.add("error");
//           password.classList.add("error");
//           smallUsername.classList.add("error");
//           smallPassword.classList.add("error");
//           smallUsername.innerText = "Khong duoc de trong";
//           smallPassword.innerText = "Khong duoc de trong";
//         } else if (username.value && password.value) {
//           username.classList.add("error");
//           password.classList.add("error");
//           smallUsername.classList.add("error");
//           smallPassword.classList.add("error");
//           smallUsername.innerText = "Ten tai khoan khong dung";
//           smallPassword.innerText = "Mat khau khong dung";
//         } else if (!username.value && password.value) {
//           username.classList.add("error");
//           password.classList.add("error");
//           smallUsername.classList.add("error");
//           smallPassword.classList.add("error");
//           smallUsername.innerText = "Khong duoc de trong";
//           smallPassword.innerText = "Mat khau khong dung";
//         } else if (username.value === getUsername.ma_nv && !password.value) {
//           username.classList.remove("error");
//           password.classList.add("error");
//           smallPassword.classList.add("error");
//           smallUsername.innerText = "";
//           smallPassword.innerText = "Vui long nhap mat khau";
//         } else if (
//           username.value === getUsername.ma_nv &&
//           password.value !== getUsername.mat_khau
//         ) {
//           username.classList.remove("error");
//           password.classList.add("error");
//           smallPassword.classList.add("error");
//           smallUsername.innerText = "";
//           smallPassword.innerText = "Mat khau khong dung";
//         }
//       }
//     } catch (error) {
//       console.log("that bai", error);
//     }
//   };
//   return (
//     <div className="signin-page">
//       <div className="container-signin">
//         <h1>Đăng Nhập</h1>
//         <div className="form-control-signin">
//           <input
//             type="text"
//             placeholder="Username"
//             value={account.username}
//             name="username"
//             onChange={handleChange}
//             className="username"
//           />
//           <small className="smallUsername">Nhập thông tin</small>
//           <span></span>
//         </div>
//         <div className="form-control-signin">
//           <input
//             type="text"
//             placeholder="Password"
//             value={account.password}
//             name="password"
//             onChange={handleChange}
//             className="password"
//           />
//           <small className="smallPassword">Nhập thông tin</small>
//           <span></span>
//         </div>
//         <button className="btn-submit" onClick={handleShow}>
//           Đăng Nhập
//         </button>
//       </div>
//     </div>
//   );
// };
// export default SignIn;

import React, { useState, useEffect, useRef } from "react";
// DÙNG USEREF DE TRANH TINH TRANG KHONG TRUY CAP DUOC PHAN TU DOM, NHU CACH BEN TREN THI KHI TRUY CAP DOM MA PHAN TU CHUA RENDER
// NEN SE KHONG CHAY THEO Ý MUỐN Ở BƯỚC ĐẦU KHI ONCLICK.
import "./SignIn.css";
import Cookies from "js-cookie";
import loginService from "../../services/loginService";

const SignIn = () => {
  const [account, setAccount] = useState({ username: "", password: "" });
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const smallUsernameRef = useRef(null);
  const smallPasswordRef = useRef(null);
  const spanUsernameRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value.trim() }));
  };

  useEffect(() => {
    console.log(account);
  }, [account]);

  const handleShow = async () => {
    try {
      const response = await loginService.compareAccount(account);
      if (response) {
        console.log(Cookies.get("token"));
        localStorage.setItem("ma_nv", response.ma_nv);
        localStorage.setItem("ten_quyen", response.ma_quyen);
        // console.log(typeof localStorage.getItem("ten_quyen"))
        alert(`CHÀO MỪNG "${response.ten_nv}" ĐÃ ĐĂNG NHẬP THÀNH CÔNG`);
        window.location.href = "/";
        console.log("thành công", response);
      } else {
        alert("TÀI KHOẢN KHÔNG HỢP LỆ");
        try {
          const getUsername = await loginService.checkUsername(account);
          console.log(getUsername);
          if (getUsername && getUsername.trang_thai === 0) {
            alert("TÊN TÀI KHOẢN KHÔNG CÒN QUYỀN TRUY CẬP");
            setAccount({ username: "", password: "" });
            smallUsernameRef.current.classList.add("error");
            smallPasswordRef.current.classList.add("error");
            smallUsernameRef.current.innerText = "Không được để trống";
            smallPasswordRef.current.innerText = "Không được để trống";
            spanUsernameRef.current.style.bottom = "18px";
          }
          if (!account.username && !account.password) {
            usernameRef.current.classList.add("error");
            passwordRef.current.classList.add("error");
            smallUsernameRef.current.classList.add("error");
            smallPasswordRef.current.classList.add("error");
            smallUsernameRef.current.innerText = "Không được để trống";
            smallPasswordRef.current.innerText = "Không được để trống";
            spanUsernameRef.current.style.bottom = "18px";
          } else if (!getUsername) {
            usernameRef.current.classList.add("error");
            passwordRef.current.classList.add("error");
            smallUsernameRef.current.classList.add("error");
            smallPasswordRef.current.classList.add("error");
            smallUsernameRef.current.innerText = "Tên tài khoản không đúng";
            smallPasswordRef.current.innerText = "Mật khẩu không đúng";
            spanUsernameRef.current.style.bottom = "18px";
          } else if (
            account.username === getUsername.ma_nv &&
            !account.password &&
            getUsername.trang_thai === 1
          ) {
            usernameRef.current.classList.remove("error");
            passwordRef.current.classList.add("error");
            smallUsernameRef.current.classList.remove("error");
            smallPasswordRef.current.classList.add("error");
            smallUsernameRef.current.innerText = "";
            smallPasswordRef.current.innerText = "Vui lòng nhập mật khẩu";
            spanUsernameRef.current.style.bottom = "0px";
          } else if (
            account.username === getUsername.ma_nv &&
            account.password !== getUsername.mat_khau &&
            getUsername.trang_thai === 1
          ) {
            usernameRef.current.classList.remove("error");
            passwordRef.current.classList.add("error");
            smallUsernameRef.current.classList.remove("error");
            smallPasswordRef.current.classList.add("error");
            smallUsernameRef.current.innerText = "";
            smallPasswordRef.current.innerText = "Mật khẩu không đúng";
            spanUsernameRef.current.style.bottom = "0px";
          }
        } catch (error) {
          console.log("lỗi:", error);
        }
      }
    } catch (error) {
      console.log("thất bại", error);
    }
  };

  const handleGetPassword = async () => {
    try {
      const emailInput = window.prompt(
        "Nhập email của bạn để lấy lại mật khẩu"
      );
      if (!emailInput) {
        return;
      }
      const getUserEmail = await loginService.checkEmailToRecoveryPassword({
        email: emailInput.trim(),
      });
      console.log(getUserEmail);
      if (!getUserEmail) {
        alert("Email của bạn không chính xác");
        handleGetPassword();
      }
      if (getUserEmail) {
        alert("Thành công! Hãy mở Gmail của bạn để lấy mật khẩu.");
      }
    } catch (error) {
      console.log("lỗi: ", error);
    }
  };

  return (
    <div className="signin-page">
      <div className="container-signin">
        <h1>Đăng Nhập</h1>
        <div className="form-control-signin">
          <input
            type="text"
            placeholder="Username"
            value={account.username}
            name="username"
            onChange={handleChange}
            ref={usernameRef}
            className="username"
          />
          <small className="smallUsername" ref={smallUsernameRef}>
            Nhập thông tin
          </small>
          <span ref={spanUsernameRef}></span>
        </div>
        <div className="form-control-signin">
          <input
            type="text"
            placeholder="Password"
            value={account.password}
            name="password"
            onChange={handleChange}
            ref={passwordRef}
            className="password"
          />
          <small className="smallPassword" ref={smallPasswordRef}>
            Nhập thông tin
          </small>
          <span></span>
        </div>
        <button className="btn-submit" onClick={handleShow}>
          Đăng Nhập
        </button>
        <div className="recovery-password" onClick={handleGetPassword}>
          Quên mật khẩu?
        </div>
      </div>
    </div>
  );
};

export default SignIn;
