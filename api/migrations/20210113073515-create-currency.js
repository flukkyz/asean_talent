'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('currencies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    }).then(() => queryInterface.addIndex('currencies', [
      'code'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('currencies')
  }
}
