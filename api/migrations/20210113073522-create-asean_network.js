'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('asean_networks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.TEXT
      },
      network_type_id: {
        type: Sequelize.INTEGER
      }
    }).then(() => queryInterface.addIndex('asean_networks', [
      'network_type_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('asean_networks')
  }
}
