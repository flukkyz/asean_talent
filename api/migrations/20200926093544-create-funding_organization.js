'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('funding_organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      department_id: {
        type: Sequelize.INTEGER
      },
      website: {
        type: Sequelize.STRING
      },
      contact_person: {
        type: Sequelize.STRING
      },
      contact_phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      keyword: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      min_budget: {
        type: Sequelize.DOUBLE
      },
      budget: {
        type: Sequelize.DOUBLE
      },
      max_budget: {
        type: Sequelize.DOUBLE
      },
      currency_id: {
        type: Sequelize.INTEGER
      },
      country_id: {
        type: Sequelize.INTEGER
      },
      city_id: {
        type: Sequelize.INTEGER
      },
      organization_type_id: {
        type: Sequelize.INTEGER
      },
      img_id: {
        type: Sequelize.INTEGER
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      lng: {
        type: Sequelize.DOUBLE
      },
      open_date: {
        type: Sequelize.DATEONLY
      },
      deadline_date: {
        type: Sequelize.DATEONLY
      },
      eligibility: {
        type: Sequelize.TEXT
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      expired_at: {
        type: Sequelize.DATE
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
    }).then(() => queryInterface.addIndex('funding_organizations', [
      'country_id'
    ])).then(() => queryInterface.addIndex('funding_organizations', [
      'department_id'
    ])).then(() => queryInterface.addIndex('funding_organizations', [
      'currency_id'
    ])).then(() => queryInterface.addIndex('funding_organizations', [
      'city_id'
    ])).then(() => queryInterface.addIndex('funding_organizations', [
      'organization_type_id'
    ])).then(() => queryInterface.addIndex('funding_organizations', [
      'img_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('funding_organizations')
  }
}
