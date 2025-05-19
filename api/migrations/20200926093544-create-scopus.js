'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('scopuses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      scopus_id: {
        type: Sequelize.STRING
      },
      keyword: {
        type: Sequelize.TEXT
      },
      scholarly_output: {
        type: Sequelize.INTEGER
      },
      most_recent_pub: {
        type: Sequelize.STRING
      },
      citation: {
        type: Sequelize.INTEGER
      },
      citation_per_pub: {
        type: Sequelize.DOUBLE
      },
      fwci: {
        type: Sequelize.DOUBLE
      },
      h_index: {
        type: Sequelize.INTEGER
      },
      citation_count: {
        type: Sequelize.INTEGER
      },
      cited_by_count: {
        type: Sequelize.INTEGER
      },
      document_count: {
        type: Sequelize.INTEGER
      },
      no_of_coauthor: {
        type: Sequelize.INTEGER
      },
      talent_id: {
        type: Sequelize.INTEGER
      },
      domain_industry: {
        type: Sequelize.TEXT
      },
      domain_industry_id: {
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
    }).then(() => queryInterface.addIndex('scopuses', [
      'talent_id'
    ])).then(() => queryInterface.addIndex('scopuses', [
      'domain_industry_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('scopuses')
  }
}
