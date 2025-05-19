'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      salt: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      refresh_token_expire_at: {
        type: Sequelize.DATE
      },
      password_reset_token: {
        type: Sequelize.STRING
      },
      password_reset_expire_at: {
        type: Sequelize.DATE
      },
      password_created_at: {
        type: Sequelize.DATE
      },
      role: {
        type: Sequelize.ENUM('admin', 'country_admin', 'secret'),
        defaultValue: 'admin'
      },
      country_id: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    }).then(() => queryInterface.addIndex('users', [
      'email'
    ])).then(() => queryInterface.addIndex('users', [
      'country_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
