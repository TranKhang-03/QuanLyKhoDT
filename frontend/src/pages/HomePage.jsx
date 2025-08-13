import React, { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import {
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
import "../style/HomePage.css";
import loginService from "../services/loginService";

const HomePage = () => {
  const listDisplay = useMemo(
    () => [
      {
        path: "/product",
        title: "Sản phẩm",
        description: "Hiển thị danh sách điện thoại có trong kho và Kiểm soát theo dõi số lượng hàng trong kho",
        image: <FaMobileAlt />,
        feature: "Quản lý sản phẩm",
      },
      {
        path: "/attribute",
        title: "Thuộc tính",
        description: "Thông tin cơ bản của một sản phẩm",
        image: <FaFilter />,
        feature: "Quản lý thuộc tính",
      },
      {
        path: "/warehouseArea",
        title: "Khu vực kho",
        description: "Liệt kê các doanh mục và mặt hàng trong kho",
        image: <FaMapMarkedAlt />,
        feature: "Quản lý khu vực kho",
      },
      {
        path: "/importForm",
        title: "Phiếu nhập",
        description: "Tạo các phiếu nhập sản phẩm từ nhà cung cấp và quản lý danh sách phiếu nhập",
        image: <FaFileImport />,
        feature: "Quản lý nhập hàng",
      },
      {
        path: "/exportForm",
        title: "Phiếu xuất",
        description: "Tạo các phiếu xuất sản phẩm cho khách hàng và quản lý danh sách phiếu xuất",
        image: <FaFileExport />,
        feature: "Quản lý xuất hàng",
      },
      {
        path: "/customer",
        title: "Khách hàng",
        description: "Liệt kê danh sách khách hàng có quan hệ kinh doanh ",
        image: <FaUser />,
        feature: "Quản lý khách hàng",
      },
      {
        path: "/provider",
        title: "Nhà cung cấp",
        description: "Liệt kê danh sách nhà cung cấp có quan hệ kinh doanh",
        image: <FaAddressCard />,
        feature: "Quản lý nhà cung cấp",
      },
      {
        path: "/employee",
        title: "Nhân viên",
        description: "Thông tin cá nhân của bạn và đăng xuất.",
        image: <FaUserCircle />,
        feature: "Quản lý nhân viên",
      },
      {
        path: "/account",
        title: "Tài khoản",
        description: "Danh sách thông tin tất cả nhân viên.",
        image: <FaUserFriends />,
        feature: "Quản lý tài khoản",
      },
      {
        path: "/permissionAccount",
        title: "Quyền tài khoản",
        description: "Liệt kê tất cả chức năng ứng với quyền hạn.",
        image: <FaUserShield />,
        feature: "Quản lý nhóm quyền",
      },
      {
        path: "/statistics",
        title: "Thống kê",
        description: "Thống kê báo cáo danh thu,tồn kho",
        image: <FaChartBar />,
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

  const [listLastDisplay, setListLastDisplay] = useState([]);

  useEffect(() => {
    const newListItems = [];
    const addedFeatures = new Set();

    for (let i = 0; i < listDisplay.length; i++) {
      if (listDisplay[i].title === "Nhân viên") {
        newListItems.push(listDisplay[i]);
        addedFeatures.add(listDisplay[i].feature);
        continue;
      }

      const findItemToAdd = dataMenu.find(
        (feature) => feature.ten_chuc_nang === listDisplay[i].feature
      );
      if (findItemToAdd && !addedFeatures.has(listDisplay[i].feature)) {
        newListItems.push(listDisplay[i]);
        addedFeatures.add(listDisplay[i].feature);
      }
    }

    setListLastDisplay(newListItems);
  }, [dataMenu, listDisplay]);
  return (
    <div className="container-homepage">
      <div className="wrapper-item-homepage">
        {listLastDisplay.map((item, index) => (
          <NavLink to={item.path} key={index} className="linkList">
            <div className="content">
              <div className="image">{item.image}</div>
              <div className="item">
                <p className="title">{item.title}</p>
                <p className="description">{item.description}</p>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
export default HomePage;
