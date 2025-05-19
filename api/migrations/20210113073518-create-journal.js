'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('journals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      publisher_id: {
        type: Sequelize.INTEGER
      }
    }).then(() => queryInterface.addIndex('journals', [
      'publisher_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('journals')
  }
}
