'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keyword: {
        type: Sequelize.TEXT
      },
      scopus_id: {
        type: Sequelize.INTEGER
      },
      domain_industry_id: {
        type: Sequelize.INTEGER
      }
    }).then(() => queryInterface.addIndex('keywords', [
      'scopus_id'
    ])).then(() => queryInterface.addIndex('keywords', [
      'domain_industry_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('keywords')
  }
}
