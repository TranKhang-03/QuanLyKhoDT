import axios from 'axios';
const apiURL = 'http://localhost:5000/api/providers';

export const getAllprovider = async () =>{
    try{
        const response = await axios.get(apiURL)
        return response.data;
    }
    catch(err){
        console.error(err)
    }
}