'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('industry_keywords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      list_keyword_id: {
        type: Sequelize.INTEGER
      },
      domain_industry_id: {
        type: Sequelize.INTEGER
      },
      talent_group: {
        type: Sequelize.ENUM('talent', 'young_talent'),
        defaultValue: 'talent'
      },
      weight: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      hit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    }).then(() => queryInterface.addIndex('industry_keywords', [
      'list_keyword_id'
    ])).then(() => queryInterface.addIndex('industry_keywords', [
      'domain_industry_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('industry_keywords')
  }
}
