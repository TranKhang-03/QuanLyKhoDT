import axios from "axios";

const CustomerService = {
    getCountCustomer : async (params) =>{
        try {
            const response = await axios.get('http://localhost:5000/api/customers/countCustomer',{params});
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }    
    },
    getAllCustom: async (params) =>{
        try{
            const response = await axios.get("http://localhost:5000/api/customers");
            return response.data
        }
        catch (err){
            console.error(err);
        }
    }
}
export default CustomerService;