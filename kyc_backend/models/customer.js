
// Defines the Customer model for storing user details
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },// made it unique so no duplicates can be inserted into the table
    dob: { type: DataTypes.DATEONLY, allowNull: false },
    registered_at: { type: DataTypes.DATE, allowNull: false },
    suburb: { type: DataTypes.STRING, allowNull: false }
  }, {
    tableName: 'customers',
    timestamps: false
  });
};
