// Handles customer-related API operations
const { Customer } = require('../models');

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

  const totalTransacted = await require('sequelize').sequelize.query(
    'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE customer_id = ?',
    { replacements: [id], type: require('sequelize').QueryTypes.SELECT }
  );

  res.json({ ...customer.toJSON(), totalTransacted: totalTransacted[0].total });
};

exports.getCustomerTransactions = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const customer = await Customer.findByPk(id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const { count, rows } = await require('../models').Transaction.findAndCountAll({
    where: { customer_id: id },
    offset: parseInt(offset),
    limit: parseInt(limit)
  });

  res.json({ total: count, page: parseInt(page), data: rows });
};
