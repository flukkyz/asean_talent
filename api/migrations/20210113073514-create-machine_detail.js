'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('machine_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },
      price: {
        type: Sequelize.DOUBLE
      },
      currency_id: {
        type: Sequelize.INTEGER
      },
      link: {
        type: Sequelize.STRING
      },
      service_condition: {
        type: Sequelize.DOUBLE
      },
      lab_location_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        field: 'created_at',
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        field: 'updated_at',
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addIndex('machine_details', [
      'currency_id'
    ])).then(() => queryInterface.addIndex('machine_details', [
      'lab_location_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('machine_details')
  }
}
