import axios from 'axios';
const apiURL = 'http://localhost:5000/api/phieuxuat';

export const getExports = async () => {
    try{
        const response = await axios.get(apiURL)
        return response.data;
    }
    catch(err){
        console.error(err)
        }
};
export const addExport = async (exportData) =>{
    try {
        await axios.post(apiURL, exportData);
      } catch (error) {
        console.error('Lỗi thêm phiếu xuất:', error);
      }
}