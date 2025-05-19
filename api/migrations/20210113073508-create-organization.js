'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      organization_type_id: {
        type: Sequelize.INTEGER
      },
      size: {
        type: Sequelize.INTEGER
      },
      product: {
        type: Sequelize.TEXT
      },
      research_area: {
        type: Sequelize.TEXT
      },
      contact_name: {
        type: Sequelize.STRING
      },
      contact_email: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      zipcode: {
        type: Sequelize.STRING
      },
      link_linkedin: {
        type: Sequelize.STRING
      },
      patient: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      country_id: {
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
    }).then(() => queryInterface.addIndex('organizations', [
      'organization_type_id'
    ])).then(() => queryInterface.addIndex('organizations', [
      'country_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('organizations')
  }
}
