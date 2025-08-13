import axios from 'axios';

const API_URL = 'http://localhost:5000/api/warehouses'; // Replace with your actual API endpoint

const WarehouseService = {
    getAllItems: async () => {
        try {
            const response = await axios.get(`${API_URL}/`);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách kho:', error);
            throw error;
        }
    },

    getItemById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching item with id ${id}:`, error);
            throw error;
        }
    },

    addItem: async (itemData) => {
        try {
            const response = await axios.post(`${API_URL}`, itemData);
            return response.data;
        } catch (error) {
            console.error('Error adding new item:', error);
            throw error;
        }
    },

    updateItem: async (id, itemData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, itemData);
            return response.data;
        } catch (error) {
            console.error(`Error updating item with id ${id}:`, error);
            throw error;
        }
    },

    deleteItem: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting item with id ${id}:`, error);
            throw error;
        }
    },

    restoreItem: async(id) => {
        try {
            const response = await axios.patch(`${API_URL}/restore/${id}`);
            return response.data;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
};

export default WarehouseService;