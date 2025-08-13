const express = require("express");
const ramController = require("../controllers/ramController");

const router = express.Router();
router.put("/:id", ramController.deleteRam);

router.get("/", ramController.getAllRams);
router.post("/", ramController.addRam);
router.put("/:id", ramController.updateRam);

module.exports = router;
