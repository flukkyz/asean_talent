'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      lng: {
        type: Sequelize.DOUBLE
      },
      hc_key: {
        type: Sequelize.STRING
      },
      country_abbrev: {
        type: Sequelize.STRING
      },
      region: {
        type: Sequelize.STRING
      },
      sub_region: {
        type: Sequelize.STRING
      },
      iso3: {
        type: Sequelize.STRING
      },
      iso2: {
        type: Sequelize.STRING
      },
      continent: {
        type: Sequelize.STRING
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('countries')
  }
}
