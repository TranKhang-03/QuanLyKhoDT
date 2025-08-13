import axios from 'axios';
const apiURL = 'http://localhost:5000/api/dtimport';

export const getDetailPN = async (ma_pn) =>{
    try{
        const response = await axios.get(`${apiURL}/${ma_pn}`);
        return response.data;
    }
    catch(err){
        console.error(err)
    }
}
export const adddtImport = async (dtimportData) =>{
    try {
        await axios.post(apiURL, dtimportData);
      } catch (error) {
        console.error('Lỗi thêm chi tiết phiếu nhập:', error);
      }
}