'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hosts', {
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
      website: {
        type: Sequelize.STRING
      },
      social_media_url: {
        type: Sequelize.STRING
      },
      keyword: {
        type: Sequelize.TEXT
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
    }).then(() => queryInterface.addIndex('hosts', [
      'country_id'
    ])).then(() => queryInterface.addIndex('hosts', [
      'city_id'
    ])).then(() => queryInterface.addIndex('hosts', [
      'organization_type_id'
    ])).then(() => queryInterface.addIndex('hosts', [
      'img_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hosts')
  }
}
