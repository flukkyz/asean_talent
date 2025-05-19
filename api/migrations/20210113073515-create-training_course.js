'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('training_courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      format: {
        type: Sequelize.ENUM('onsite', 'online', 'hybrid'),
        defaultValue: 'onsite'
      },
      instructor_name: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      detail_date: {
        type: Sequelize.TEXT
      },
      cost: {
        type: Sequelize.DOUBLE
      },
      currency_id: {
        type: Sequelize.INTEGER
      },
      place: {
        type: Sequelize.TEXT
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      keyword: {
        type: Sequelize.TEXT
      },
      university_id: {
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
      hit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    }).then(() => queryInterface.addIndex('training_courses', [
      'country_id'
    ])).then(() => queryInterface.addIndex('training_courses', [
      'currency_id'
    ])).then(() => queryInterface.addIndex('training_courses', [
      'city_id'
    ])).then(() => queryInterface.addIndex('training_courses', [
      'university_id'
    ])).then(() => queryInterface.addIndex('training_courses', [
      'organization_type_id'
    ])).then(() => queryInterface.addIndex('training_courses', [
      'img_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('training_courses')
  }
}
