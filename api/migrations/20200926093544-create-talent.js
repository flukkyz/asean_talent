'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('talents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female'),
        defaultValue: 'Male'
      },
      link_linkedin: {
        type: Sequelize.STRING
      },
      research_gate: {
        type: Sequelize.STRING
      },
      link_tnrr: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      domicile_id: {
        type: Sequelize.INTEGER
      },
      country_id: {
        type: Sequelize.INTEGER
      },
      city_id: {
        type: Sequelize.INTEGER
      },
      university_id: {
        type: Sequelize.INTEGER
      },
      religion_id: {
        type: Sequelize.INTEGER
      },
      img_id: {
        type: Sequelize.INTEGER
      },
      hit_scopus: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      hit_linkedin: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      hit_research_gate: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      hit_link_tnrr: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      talent_group: {
        type: Sequelize.ENUM('talent', 'young_talent'),
        defaultValue: 'talent'
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
    }).then(() => queryInterface.addIndex('talents', [
      'country_id'
    ])).then(() => queryInterface.addIndex('talents', [
      'domicile_id'
    ])).then(() => queryInterface.addIndex('talents', [
      'city_id'
    ])).then(() => queryInterface.addIndex('talents', [
      'university_id'
    ])).then(() => queryInterface.addIndex('talents', [
      'religion_id'
    ])).then(() => queryInterface.addIndex('talents', [
      'img_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('talents')
  }
}
