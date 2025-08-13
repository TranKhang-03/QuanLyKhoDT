import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Product from "./pages/Product.jsx";
import Attribute from "./pages/Attribute.jsx";
import WarehouseArea from "./pages/WarehouseArea.jsx";
import ImportForm from "./pages/ImportForm.jsx";
import ExportForm from "./pages/ExportForm.jsx";
import Customer from "./pages/Customer.jsx";
import Provider from "./pages/Provider.jsx";
import Employee from "./pages/Employee.jsx";
import Account from "./pages/Account.jsx";
import PermissionAccount from "./pages/PermissionAccount.jsx";
import Statistics from "./pages/Statistics.jsx";
import HomePage from "./pages/HomePage.jsx";
import SignIn from "./components/SignIn/SignIn.jsx";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
const App = () => {
  const [notLogin, setNotLogin] = useState(true);
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setNotLogin(false);
    }
  }, []);
  return !notLogin ? (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/attribute" element={<Attribute />} />
          <Route path="/warehouseArea" element={<WarehouseArea />} />
          <Route path="/importForm" element={<ImportForm />} />
          <Route path="/exportForm" element={<ExportForm />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/provider" element={<Provider />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/account" element={<Account />} />
          <Route path="/permissionAccount" element={<PermissionAccount />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  ) : (
    <SignIn />
  );
};

export default App;
