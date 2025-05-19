'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('collaborations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      co_author_id: {
        type: Sequelize.INTEGER
      },
      talent_id: {
        type: Sequelize.INTEGER
      }
    }).then(() => queryInterface.addIndex('collaborations', [
      'co_author_id'
    ])).then(() => queryInterface.addIndex('collaborations', [
      'talent_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('collaborations')
  }
}
