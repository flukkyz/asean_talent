'use strict'
const db = require('../models')
const setting = require('./generates/setting')
const users = require('./generates/users')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('setting', setting)

    for (const user of users) {
      await db.User.create({
        name: user.name.trim(),
        email: user.email.trim(),
        password: user.password.trim(),
        role: 'admin'
      })
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('setting', null)
    await queryInterface.bulkDelete('users', null)
  }
}
