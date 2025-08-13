import axios from 'axios';


const thongkeService = {
    getThongKeKhachHang: async (params) => {
        try {
            const response = await axios.get('http://localhost:5000/api/thongke/thongKeKhachHang',{params});
            return response.data
        }
        catch(error){
            console.error("Error fetching products:", error);
            return [];
        }
    },
    getThongKeProvider : async (params) =>{
        try{
            const response = await axios.get('http://localhost:5000/api/thongke/thongKeNhaCungCap',{params});
            return response.data;
        }catch(error){
            console.error("Error fetching products:", error);
            return [];
        }
    },
    getThongKeTonKho : async (params) =>{
        try{
            const respone = await axios.get('http://localhost:5000/api/thongke/thongKeNhapXuat',{params});
            return respone.data;
        }catch(error){
            console.error("Error fetching products:", error);
            return [];
        }
    },
    getThongKeTheoNam: async(params)=>{
        try {
            const response = await axios.get('http://localhost:5000/api/thongke/thongKeTheoNam',{params});
            return response.data;
        } catch (error) {
            console.error("Error fetching statistics",error);
            return [];
        }
    },
    getThongKeTheoThang: async(params)=>{
        try {
            const response = await axios.get('http://localhost:5000/api/thongke/thongKeTheoThang',{params});
            return response.data;
        } catch (error) {
            console.error("Error fetching statistics",error);
            return [];
        }
    },
    getThongKeTheoNgay: async(params)=>{
        try {
            const response = await axios.get('http://localhost:5000/api/thongke/thongKeTheoNgay',{params});
            return response.data;
        } catch (error) {
            console.error("Error fetching statistics",error);
            return [];
        }
    },
    getThongKe7NgayGanNhat: async(params)=>{
        try {
            const response = await axios.get('http://localhost:5000/api/thongke/thongKe7NgayGanNhat',{params});
            return response.data;
        } catch (error) {
            console.error("Error fetching statistics",error);
            return [];
        }
    },
    getThongKeNgayDenNgay: async(params)=>{
        try {
            const response = await axios.get('http://localhost:5000/api/thongke/thongKeNgayDenNgay',{params});
            return response.data;
        } catch (error) {
            console.error("Error fetching statistics",error);
            return [];
        }
    }
    
}
export default thongkeService;