'use strict'
const db = require('../models')
const setting = require('./generates/setting')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('setting', setting)
    await db.User.create({
      name: 'Admin',
      email: 'admin@admin.admin',
      password: 'Ss123456',
      role: 'admin'
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('setting', null)
    await queryInterface.bulkDelete('users', null)
  }
}
