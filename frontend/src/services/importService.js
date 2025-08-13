import axios from 'axios';
const apiURL = 'http://localhost:5000/api/import';

export const getImports = async () => {
    try{
        const response = await axios.get(apiURL)
        return response.data;
    }
    catch(err){
        console.error(err)
        }
};

export const getipById = async (ma_pn) => {
    try{
        const response = await axios.get(`${apiURL}/${ma_pn}`);
        return response.data;
    }
    catch(err){
        console.error(err)
    }
}

export const addImport = async (importData) =>{
    try {
        await axios.post(apiURL, importData);
      } catch (error) {
        console.error('Lỗi thêm phiếu nhập:', error);
      }
}