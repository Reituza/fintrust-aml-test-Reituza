// Initializes Sequelize and loads models
const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    port: config.development.port
  }
);

const Customer = require('./customer')(sequelize);
const Transaction = require('./transaction')(sequelize);
const HighRiskSuburb = require('./highRiskSuburb')(sequelize);

// Set up associations
Customer.hasMany(Transaction, { foreignKey: 'customer_id' });
Transaction.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = {
  sequelize,
  Customer,
  Transaction,
  HighRiskSuburb
};
