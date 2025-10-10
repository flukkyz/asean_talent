'use strict'
const db = require('../models')
const setting = require('./generates/setting')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('setting', setting)

    const users = [
      'admin@admin.admin'
      // 'user1@admin.admin',
      // 'user2@admin.admin'
    ]

    for (const [index, user] of users.entries()) {
      await db.User.create({
        name: `Admin${index + 1}`,
        email: user,
        password: '111111',
        role: 'admin'
      })
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('setting', null)
    await queryInterface.bulkDelete('users', null)
  }
}
