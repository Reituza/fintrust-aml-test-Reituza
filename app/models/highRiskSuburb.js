
// Defines the HighRiskSuburb model for storing high-risk suburbs
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('HighRiskSuburb', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    suburb: { type: DataTypes.STRING, allowNull: false, unique: true }
  }, {
    tableName: 'high_risk_suburbs',
    timestamps: false
  });
};
