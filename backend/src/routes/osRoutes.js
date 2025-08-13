const express = require("express");
const osController = require("../controllers/osController");

const router = express.Router();
router.put("/:id", osController.deleteOperatingSystem);
router.get("/", osController.getAllOperatingSystems);
router.post("/", osController.addOperatingSystem);
router.put("/:id", osController.updateOperatingSystem);

module.exports = router;
