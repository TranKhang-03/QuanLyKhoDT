const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");

router.get("/layten/:ma_quyen", permissionController.getPermissionByMaQuyen);
router.get("/show", permissionController.showAllPermission);
router.get("/show_feature", permissionController.showAllFeature)
router.put("/change_role/:ma_quyen", permissionController.changeRole)
router.put("/update_role/:ma_nv", permissionController.updateRole)
router.put("/delete_role/:ma_nv", permissionController.deleteRole)

module.exports = router;
