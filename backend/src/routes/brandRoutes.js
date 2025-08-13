// routes/brandRoutes.js
const express = require("express");
const brandController = require("../controllers/brandController");

const router = express.Router();
router.put("/:id", brandController.deleteBrand);
router.get("/", brandController.getAllBrands);
router.post("/", brandController.addBrand);
router.put("/:id", brandController.updateBrand);

module.exports = router;
