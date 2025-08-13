// frontend/src/services/EmployeeService.js

import axios from 'axios'; 

// Tạo một đối tượng axios với base URL từ backend
const apiUrl = 'http://localhost:5000/api/employee'; // Địa chỉ backend của bạn

// Lấy tất cả nhân viên
export const getEmployees = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// Lấy thông tin nhân viên theo ma_nv
export const getEmployeeByMaNV = async (ma_nv) => {
  try {
    const response = await axios.get(`${apiUrl}/${ma_nv}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${ma_nv}:`, error);
    throw error;
  }
};

// Thêm một nhân viên mới
export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(apiUrl, employeeData);
    return response.data;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

// Cập nhật thông tin nhân viên
export const updateEmployee = async (ma_nv, employeeData) => {
  try {
    const response = await axios.put(`${apiUrl}/${ma_nv}`, employeeData);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${ma_nv}:`, error);
    throw error;
  }
};

// Xóa nhân viên
export const deleteEmployee = async (ma_nv) => {
  try {
    const response = await axios.delete(`${apiUrl}/${ma_nv}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee ${ma_nv}:`, error);
    throw error;
  }
};
export const getCountEmployee = async (params) =>{
  try {
    const response = await axios.get(`${apiUrl}/countEmployee`);
    return response.data;
  } catch (error) {
    console.error(`Error count employee :`, error);
    throw error;
  }
}
