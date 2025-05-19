'use strict'
const db = require('../models')
const setting = require('./generates/setting')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('setting', setting)
    await db.User.create({
      name: 'Admin',
      username: 'admin',
      password: 'Ss123456',
      role: 'admin'
    })
    const sql = `INSERT INTO users (username, password, salt, name, refresh_token, refresh_token_expire_at, role, created_at, updated_at) VALUES
    ('Phusit', '$2b$10$lC1aky5WjS1NdUqVFseiEuNLPVce7z4ciyjj0Qxl4rVQoC5eNXPZi', '$2b$10$lC1aky5WjS1NdUqVFseiEu', 'Phusit Kornsurin', NULL, NULL, 'admin', '2023-06-06 21:51:55', '2023-06-06 21:51:55'),
    ('Pachara', '$2b$10$V8WSW.qxCrfaofsLRQchpu0ZoHdT8D85FbYJh719BW1SKnrny3wsq', '$2b$10$V8WSW.qxCrfaofsLRQchpu', 'Pachara Tinamas', NULL, NULL, 'admin', '2023-06-06 21:52:34', '2023-06-07 16:48:06');`
    await db.sequelize.query(sql)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('setting', null)
    await queryInterface.bulkDelete('users', null)
  }
}
