'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('high_risk_suburbs', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      suburb: { type: Sequelize.STRING, allowNull: false, unique: true }
    });

    const suburbs = ['Hillbrow', 'Yeoville', 'Berea', 'Joubert Park', 'Soweto', 'Alexandra', 'Orange Farm', 'Daveyton', 'Thembisa', 'Katlehong', 'Springs', 'Nigel', 'Diepsloot', 'Tembisa', 'Ekurhuleni'];
    await queryInterface.bulkInsert('high_risk_suburbs', suburbs.map(suburb => ({ suburb })));
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('high_risk_suburbs');
  }
};
