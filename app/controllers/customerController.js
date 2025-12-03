// Handles customer-related API operations
const { Customer, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

exports.getCustomers = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const where = search ? {
    [require('sequelize').Op.or]: [
      { name: { [require('sequelize').Op.iLike]: `%${search}%` } },
      { email: { [require('sequelize').Op.iLike]: `%${search}%` } }
    ]
  } : {};

  const { count, rows } = await Customer.findAndCountAll({
    where,
    offset: parseInt(offset),
    limit: parseInt(limit)
  });

  res.json({ total: count, page: parseInt(page), data: rows });
};

exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  const customer = await Customer.findByPk(id);

  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const totalTransacted = await sequelize.query(
    'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE customer_id = ?',
    { replacements: [id], type: QueryTypes.SELECT }
  );

  res.json({ ...customer.toJSON(), totalTransacted: totalTransacted[0].total });
};

exports.getCustomerTransactions = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const customer = await Customer.findByPk(id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const { Transaction } = require('../models');
  const { count, rows } = await Transaction.findAndCountAll({
    where: { customer_id: id },
    offset: parseInt(offset),
    limit: parseInt(limit)
  });

  res.json({ total: count, page: parseInt(page), data: rows });
};
