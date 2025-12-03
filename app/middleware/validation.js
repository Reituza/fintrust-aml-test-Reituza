// Validation middleware for transaction input
exports.validateTransaction = (req, res, next) => {
  const { customer_id, amount, destination_suburb } = req.body;

  if (!customer_id) return res.status(400).json({ error: 'customer_id is required' });
  if (!amount) return res.status(400).json({ error: 'amount is required' });
  if (!destination_suburb) return res.status(400).json({ error: 'destination_suburb is required' });

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  if (typeof customer_id !== 'number' || customer_id <= 0) {
    return res.status(400).json({ error: 'customer_id must be a positive integer' });
  }

  if (typeof destination_suburb !== 'string' || destination_suburb.trim().length === 0) {
    return res.status(400).json({ error: 'destination_suburb must be a non-empty string' });
  }

  next();
};

exports.validateCustomerSearch = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || page < 1)) {
    return res.status(400).json({ error: 'page must be a positive integer' });
  }

  if (limit && (isNaN(limit) || limit < 1)) {
    return res.status(400).json({ error: 'limit must be a positive integer' });
  }

  next();
};
