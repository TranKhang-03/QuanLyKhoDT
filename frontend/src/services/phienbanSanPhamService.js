import axios from 'axios';
const apiURL = 'http://localhost:5000/api/pbsp';

export const getpbSP = async () => {
    try{
        const response = await axios.get(apiURL)
        return response.data;
    }
    catch(err){
        console.error(err)
        }
};

export const updatedTonKho = async (ma_phien_ban_sp, so_luong_moi) =>{
    try {
        await axios.patch(`${apiURL}/${ma_phien_ban_sp}`, so_luong_moi);
      } catch (error) {
        console.error(error);
      }
}