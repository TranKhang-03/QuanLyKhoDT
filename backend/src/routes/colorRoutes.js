const express = require("express");
const colorController = require("../controllers/colorController");

const router = express.Router();
router.put("/:id", colorController.deleteColor);
router.get("/", colorController.getAllColors);
router.post("/", colorController.addColor);
router.put("/:id", colorController.updateColor);

module.exports = router;
