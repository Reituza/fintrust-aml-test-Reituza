// Routes for customer and transaction endpoints
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const transactionController = require('../controllers/transactionController');

router.get('/customers', customerController.getCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.get('/customers/:id/transactions', customerController.getCustomerTransactions);

router.post('/transactions', transactionController.createTransaction);
router.get('/alerts', transactionController.getAlerts);

module.exports = router;
