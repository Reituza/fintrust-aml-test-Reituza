// Routes for customer and transaction endpoints
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const transactionController = require('../controllers/transactionController');
const { validateTransaction, validateCustomerSearch } = require('../middleware/validation');

router.get('/customers', validateCustomerSearch, customerController.getCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.get('/customers/:id/transactions', validateCustomerSearch, customerController.getCustomerTransactions);

router.post('/transactions', validateTransaction, transactionController.createTransaction);
router.get('/alerts', transactionController.getAlerts);

module.exports = router;
