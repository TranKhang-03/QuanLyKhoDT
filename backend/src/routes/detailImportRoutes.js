const express = require("express");
const detailImportController = require("../controllers/detailImportController")

const router = express.Router();
router.get('/:ma_pn', detailImportController.getDetailImport)
router.post('/', detailImportController.adddetailImport)

module.exports = router 