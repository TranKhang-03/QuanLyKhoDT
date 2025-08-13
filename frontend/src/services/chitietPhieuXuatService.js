import axios from 'axios';
const apiURL = 'http://localhost:5000/api/chitietphieuxuat';

export const getDetailPX = async(ma_px) =>{
    try{
        const response = await axios.get(`${apiURL}/${ma_px}`);
        return response.data;
    }
    catch(err){
        console.error(err)
    }
}