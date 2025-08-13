
const express = require('express')
const router = express.Router()
const warehousecontroller = require('../controllers/WareHouseController')

router.get('/', warehousecontroller.getAllWarehouse)
router.get('/:ma_kho',warehousecontroller.getWarehouseByID)
router.post('/', warehousecontroller.createWarehouse)
router.put('/:ma_kho',warehousecontroller.updateWarehouse)
router.delete('/:ma_kho',warehousecontroller.deleteWarehouse)
router.patch('/restore/:ma_kho',warehousecontroller.restoreWarehouse)

module.exports = router