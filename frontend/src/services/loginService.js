import axios from "axios";

const loginService = {
  compareAccount: async (account) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/login/`,
        account,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
  checkUsername: async (username) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/login/checkUsername`,
        username
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
  checkEmailToRecoveryPassword: async (email) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/login/checkEmailToRecoveryPassword`,
        email
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
  getFeatureFromToken: async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/login/getFeatureFromToken`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  },
};
export default loginService;
