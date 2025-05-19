'use strict'
const fs = require('fs')
const path = require('path')
// const religions = require('./references/religions')
const countries = require('./references/countries')
const organizationTypes = require('./references/organizationTypes')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert('religions', religions)
    await queryInterface.bulkInsert('organization_types', organizationTypes)
    await queryInterface.bulkInsert('countries', countries)
    let cities = []
    await fs
      .readdirSync(path.join(__dirname, './references/cities'))
      .forEach((file) => {
        const city = require(path.join(__dirname, './references/cities', file))
        cities = [
          ...cities,
          ...city
        ]
      })
    await queryInterface.bulkInsert('cities', cities)
  },
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('religions', null)
    await queryInterface.bulkInsert('organization_types', null)
    await queryInterface.bulkDelete('countries', null)
    await queryInterface.bulkDelete('cities', null)
  }
}
