const express = require("express");
const phieuxuatController = require("../controllers/phieuxuatController")

const router = express.Router();

router.get("/", phieuxuatController.getExports);
router.get("/:ma_px", phieuxuatController.getExportByID);
router.post("/", phieuxuatController.addExport);

module.exports = router;