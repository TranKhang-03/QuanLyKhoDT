import axios from "axios";

const API_URL = "http://localhost:5000/api/products";
const productService = {
  getAllProducts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },
  createProduct: async (product) => {
    try {
      const response = await axios.post(API_URL, product);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },
  deleteProduct: async (ma_sp) => {
    try {
      // Gửi yêu cầu PATCH để cập nhật trạng thái thành 0
      const response = await axios.patch(`${API_URL}/${ma_sp}`, {
        trang_thai: 0,
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Không thể xóa sản phẩm");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  getCountProduct: async (params) => {
    try {
      const response = await axios.get(`${API_URL}/countProduct`);
      return response.data;
    } catch (error) {
      console.error("Error getting count product:", error);
      return [];
    }
  },
  updatedTonKho: async (ma_sp, so_luong_moi) => {
    try {
      await axios.patch(`${API_URL}/${ma_sp}`, so_luong_moi);
    } catch (error) {
      console.error(error);
    }
  },
  updateWarehouse: async (ma_sp, ma_kho_moi) => {
    try {
      const response = await axios.patch(`${API_URL}/${ma_sp}/ma_kho`, {
        ma_kho: ma_kho_moi,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi api cập nhật", error);
      throw error;
    }
  },
};

export default productService;
