import React, { useEffect, useState, useMemo } from "react";
import {
  FaBars,
  FaHome,
  FaMobileAlt,
  FaFilter,
  FaMapMarkedAlt,
  FaFileExport,
  FaFileImport,
  FaUser,
  FaAddressCard,
  FaUserCircle,
  FaChartBar,
  FaUserFriends,
  FaUserShield,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import loginService from "../services/loginService";

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const menuItem = useMemo(
    () => [
      {
        path: "/homePage",
        name: "Trang chủ",
        icon: <FaHome />,
      },
      {
        path: "/product",
        name: "Sản phẩm",
        icon: <FaMobileAlt />,
        feature: "Quản lý sản phẩm",
      },
      {
        path: "/attribute",
        name: "Thuộc tính",
        icon: <FaFilter />,
        feature: "Quản lý thuộc tính",
      },
      {
        path: "/warehouseArea",
        name: "Khu vực kho",
        icon: <FaMapMarkedAlt />,
        feature: "Quản lý khu vực kho",
      },
      {
        path: "/importForm",
        name: "Phiếu nhập",
        icon: <FaFileImport />,
        feature: "Quản lý nhập hàng",
      },
      {
        path: "/exportForm",
        name: "Phiếu xuất",
        icon: <FaFileExport />,
        feature: "Quản lý xuất hàng",
      },
      {
        path: "/customer",
        name: "Khách hàng",
        icon: <FaUser />,
        feature: "Quản lý khách hàng",
      },
      {
        path: "/provider",
        name: "Nhà cung cấp",
        icon: <FaAddressCard />,
        feature: "Quản lý nhà cung cấp",
      },
      {
        path: "/employee",
        name: "Nhân viên",
        icon: <FaUserCircle />,
        feature: "Quản lý nhân viên",
      },
      {
        path: "/account",
        name: "Tài khoản",
        icon: <FaUserFriends />,
        feature: "Quản lý tài khoản",
      },
      {
        path: "/permissionAccount",
        name: "Quyền tài khoản",
        icon: <FaUserShield />,
        feature: "Quản lý nhóm quyền",
      },
      {
        path: "/statistics",
        name: "Thống kê",
        icon: <FaChartBar />,
        feature: "Quản lý thống kê",
      },
    ],
    []
  );

  const [dataMenu, setDataMenu] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await loginService.getFeatureFromToken();
      setDataMenu(response);
    };
    fetchData();
  }, []);

  const [menuLastShow, setMenuLastShow] = useState([]);
  // useEffect(() => {
  //   for (let i = 0; i < menuItem.length; i++) {
  //     if (menuItem[i].name === "Trang chủ") {
  //       setMenuLastShow((prev) => [...prev, menuItem[i]]);
  //       continue;
  //     }
  //     const findItemToAdd = dataMenu.find(
  //       (feature) => feature.ten_chuc_nang === menuItem[i].feature
  //     );
  //     if (findItemToAdd) {
  //       setMenuLastShow((prev) => [...prev, menuItem[i]]);
  //     }
  //   }
  // }, [dataMenu, menuItem]);
  // nếu làm như thế này khi component mounted nó sẽ gây ra tình trạng menu sẽ hiển thị không đúng, dẫn đến lặp đi lặp lại menu

  useEffect(() => {
    const newMenuItems = []; // Mảng tạm để chứa các phần tử mới
    const addedFeatures = new Set(); // Set để theo dõi các chức năng đã thêm

    for (let i = 0; i < menuItem.length; i++) {
      if (
        menuItem[i].name === "Trang chủ" ||
        menuItem[i].name === "Nhân viên"
      ) {
        newMenuItems.push(menuItem[i]); // Thêm "Trang chủ" vào danh sách(Mặc định)
        addedFeatures.add(menuItem[i].feature); // Đánh dấu chức năng đã thêm
        continue;
      }

      const findItemToAdd = dataMenu.find(
        (feature) => feature.ten_chuc_nang === menuItem[i].feature
      );
      if (findItemToAdd && !addedFeatures.has(menuItem[i].feature)) {
        newMenuItems.push(menuItem[i]); // Thêm phần tử nếu chức năng đã tìm thấy và chưa được thêm
        addedFeatures.add(menuItem[i].feature); // Đánh dấu chức năng đã thêm
      }
    }

    setMenuLastShow(newMenuItems); // Cập nhật state với các menu mới
  }, [dataMenu, menuItem]);

  return (
    <div className="container">
      <div style={{ width: isOpen ? "250px" : "50px" }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            Logo
          </h1>
          <div style={{ marginLeft: isOpen ? "90px" : "0px" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        {menuLastShow.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className="link"
            activeClassName="active"
          >
            <div
              style={{ paddingLeft: isOpen ? "5px" : "10px" }}
              className="icon"
            >
              {item.icon}
            </div>
            <div
              style={{ display: isOpen ? "block" : "none" }}
              className="link_text"
            >
              {item.name}
            </div>
          </NavLink>
        ))}
      </div>
      <main>{children}</main>
    </div>
  );
};
export default Sidebar;
