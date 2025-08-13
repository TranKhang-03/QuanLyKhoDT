const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Define API routes for employee
router.get('/', employeeController.getEmployees); // Get all employees
router.get('/countEmployee',employeeController.countEmployee); // count  employees
router.get('/:ma_nv', employeeController.getEmployeeByMaNV); // Get employee by ma_nv
router.post('/', employeeController.addEmployee); // Create new employee
router.put('/:ma_nv', employeeController.updateEmployee); // Update employee by ma_nv
router.delete('/:ma_nv', employeeController.deleteEmployee); // Delete employee by ma_nv

module.exports = router;
