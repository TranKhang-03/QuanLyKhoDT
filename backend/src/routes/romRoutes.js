const express = require("express");
const romController = require("../controllers/romController");

const router = express.Router();
router.put("/:id", romController.deleteRom);
router.get("/", romController.getAllRoms);
router.post("/", romController.addRom);
router.put("/:id", romController.updateRom);

module.exports = router;
