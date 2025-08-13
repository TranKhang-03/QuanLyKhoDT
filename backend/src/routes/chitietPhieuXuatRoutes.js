const express = require("express");
const chitietPhieuXuatController = require("../controllers/chitietPhieuXuatController")
const router = express.Router();

router.get('/:ma_px', chitietPhieuXuatController.getDetailExport);
module.exports = router; 