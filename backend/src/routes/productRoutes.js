const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Định nghĩa route API cho sản phẩm
router.get("/", productController.getAllProducts);
router.post("/", productController.addProduct);
router.put("/:ma_sp", productController.updateProduct)
// Cập nhật trạng thái sản phẩm (xóa)
router.patch("/:ma_sp", productController.deleteProduct);
router.get("/countProduct", productController.getCountProduct);
router.patch("/:ma_sp", productController.updatedCountProduct);
router.patch("/:ma_sp/ma_kho", productController.updateWarehouseProduct);
module.exports = router;
