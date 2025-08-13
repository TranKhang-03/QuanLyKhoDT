import axios from "axios";

const permissionService = {
  showAllPermission: async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/permission/show"
      );
      return response.data;
    } catch (error) {
      console.error("Error getting permission:", error);
      throw error;
    }
  },
  showAllFeature: async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/permission/show_feature"
      );
      return response.data;
    } catch (error) {
      console.error("error getting feature:", error);
    }
  },
  updateRole: async (maNvID, roleID) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/permission/update_role/${maNvID}`,
        roleID
      );
      return response.data;
    } catch (error) {
      console.log("error updating role: ", error);
      throw error;
    }
  },
  deleteRole: async (maNvID) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/permission/delete_role/${maNvID}`
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi xóa nhân viên:", error);
      throw error;
    }
  },
  changeRole: async (roleID, listFeature) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/permission/change_role/${roleID}`,
        listFeature
      );
      return response.data;
    } catch (error) {
      console.log("Lỗi khi thay đổi chức năng:", error);
      throw error;
    }
  },
};

export default permissionService;
