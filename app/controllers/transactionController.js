// Handles transaction-related API operations and suspicious rule checks
const { Transaction, Customer, HighRiskSuburb, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createTransaction = async (req, res) => {
  const { customer_id, amount, destination_suburb } = req.body;

  if (!customer_id || !amount || !destination_suburb) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (amount <= 0) {
    return res.status(400).json({ error: 'Amount must be positive' });
  }

  const customer = await Customer.findByPk(customer_id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const transaction = await Transaction.create({
    customer_id,
    amount: parseFloat(amount),
    destination_suburb,
    created_at: new Date()
  });

  res.status(201).json(transaction);
};

exports.getAlerts = async (req, res) => {
  const transactions = await Transaction.findAll({ include: [Customer] });
  const highRiskSuburbsData = await HighRiskSuburb.findAll();
  const highRiskSuburbs = highRiskSuburbsData.map(h => h.suburb);
  const alerts = [];

  for (const txn of transactions) {
    const reasons = [];
    const customer = txn.dataValues.Customer;

    const age = Math.floor((Date.now() - new Date(customer.dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const registeredDaysAgo = Math.floor((Date.now() - new Date(customer.registered_at).getTime()) / (24 * 60 * 60 * 1000));

    if (txn.amount > 10000 && age < 25) {
      reasons.push('Rule 1: Amount > 10,000 ZAR and customer age < 25');
    }

    if (txn.amount > 15000 && registeredDaysAgo < 30) {
      reasons.push('Rule 2: Amount > 15,000 ZAR and customer registered < 30 days ago');
    }

    if (highRiskSuburbs.includes(txn.destination_suburb)) {
      reasons.push('Rule 3: Destination suburb is in high-risk list');
    }

    const suspiciousEndings = [0, 500, 900, 950, 990, 999];
    const amountStr = txn.amount.toString();
    if (txn.amount > 5000 && suspiciousEndings.some(end => amountStr.endsWith(end.toString()))) {
      reasons.push('Rule 4: Round amount ending with suspicious pattern and amount > 5,000 ZAR');
    }

    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTxns = await Transaction.findAll({
      where: {
        customer_id: txn.customer_id,
        created_at: { [Op.gte]: last24h }
      }
    });

    const recent24hAmount = recentTxns.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    if (recentTxns.length > 3 && recent24hAmount > 20000) {
      reasons.push('Rule 5: Velocity - more than 3 transactions in 24h with total > 20,000 ZAR');
    }

    if (reasons.length > 0) {
      alerts.push({
        transaction_id: txn.id,
        customer_id: txn.customer_id,
        amount: txn.amount,
        destination_suburb: txn.destination_suburb,
        created_at: txn.created_at,
        reasons: reasons.join('; ')
      });
    }
  }

  res.json(alerts);
};
