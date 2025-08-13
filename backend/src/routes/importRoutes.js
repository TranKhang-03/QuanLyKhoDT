const express = require("express");
const importController = require('../controllers/ImportController')

const router = express.Router();

router.get("/", importController.getImports);
router.get("/:ma_pn", importController.getImportByID)
router.post("/", importController.addImport)

module.exports = router;