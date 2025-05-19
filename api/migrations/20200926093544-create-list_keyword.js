'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('list_keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keyword: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      weight: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      hit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }).then(() => queryInterface.addIndex('list_keywords', [
      'keyword'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('list_keywords')
  }
}
