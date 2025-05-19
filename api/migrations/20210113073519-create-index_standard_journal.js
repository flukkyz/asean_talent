'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('index_standard_journals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      index_standard_id: {
        type: Sequelize.INTEGER
      },
      journal_id: {
        type: Sequelize.INTEGER
      }
    }).then(() => queryInterface.addIndex('index_standard_journals', [
      'index_standard_id'
    ])).then(() => queryInterface.addIndex('index_standard_journals', [
      'journal_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('index_standard_journals')
  }
}
