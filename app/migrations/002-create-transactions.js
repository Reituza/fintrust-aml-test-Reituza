'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      customer_id: { type: Sequelize.INTEGER, allowNull: false },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      destination_suburb: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};
