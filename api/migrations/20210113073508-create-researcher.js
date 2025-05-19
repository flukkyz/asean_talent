'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('researchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Unspecified'),
        defaultValue: 'Male'
      },
      title: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      middlename: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      department: {
        type: Sequelize.STRING
      },
      organization: {
        type: Sequelize.STRING
      },
      keyword: {
        type: Sequelize.TEXT
      },
      expert: {
        type: Sequelize.TEXT
      },
      case_study: {
        type: Sequelize.TEXT
      },
      research_country: {
        type: Sequelize.TEXT
      },
      length: {
        type: Sequelize.INTEGER
      },
      graduate: {
        type: Sequelize.TEXT
      },
      hot_issue: {
        type: Sequelize.TEXT
      },
      graduate_country_id: {
        type: Sequelize.INTEGER
      },
      religion: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      link_scopus: {
        type: Sequelize.STRING
      },
      link_linkedin: {
        type: Sequelize.STRING
      },
      research_gate: {
        type: Sequelize.STRING
      },
      cv: {
        type: Sequelize.STRING
      },
      patient: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING
      },
      country_id: {
        type: Sequelize.INTEGER
      },
      no_of_coauthor: {
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
    }).then(() => queryInterface.addIndex('researchers', [
      'graduate_country_id'
    ])).then(() => queryInterface.addIndex('researchers', [
      'country_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('researchers')
  }
}
