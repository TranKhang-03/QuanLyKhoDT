const express = require("express");
const pbspController = require("../controllers/phienbanSPController");

const router = express.Router();
router.post("/", pbspController.addConfigurations);

router.get("/", pbspController.getAllPBSP);
router.patch("/:ma_phien_ban_sp", pbspController.updatedSL);

module.exports = router;
