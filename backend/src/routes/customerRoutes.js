const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Define API routes for Customer
router.get('/', customerController.getCustomer); // Get all Customer
router.get('/countCustomer', customerController.getCountCustomer) // count Customer
router.get('/:ma_kh', customerController.getCustomerByMaKH); // Get Customer by ma_kh
router.post('/', customerController.addCustomer); // Create new Customer
router.put('/:ma_kh', customerController.updateCustomer); // Update Customer by ma_kh
router.delete('/:ma_kh', customerController.deleteCustomer); // Delete Customer by ma_kh
module.exports = router;