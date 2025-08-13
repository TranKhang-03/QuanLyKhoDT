

const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');

// Define API routes for Customer
router.get('/', providerController.getProvider); // Get all Customer
router.get('/:ma_ncc', providerController.getProviderByMaNCC); // Get Customer by ma_kh
router.post('/', providerController.addProvider); // Create new Customer
router.put('/:ma_ncc', providerController.updateProvider); // Update Customer by ma_kh
router.delete('/:ma_ncc', providerController.deleteProvider); // Delete Customer by ma_kh

module.exports = router;