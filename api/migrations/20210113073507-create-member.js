'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('members', {
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
      lang: {
        type: Sequelize.ENUM('th', 'en', 'zh', 'lo'),
        defaultValue: 'en'
      },
      refresh_token: {
        type: Sequelize.STRING
      },
      refresh_token_expire_at: {
        type: Sequelize.DATE
      },
      member_type: {
        type: Sequelize.ENUM('researcher', 'organization')
      },
      researcher_id: {
        type: Sequelize.INTEGER
      },
      organization_id: {
        type: Sequelize.INTEGER
      },
      data_privacy_id: {
        type: Sequelize.INTEGER
      },
      avatar: {
        type: Sequelize.STRING
      },
      facebook_id: {
        type: Sequelize.STRING(191),
        unique: true
      },
      google_id: {
        type: Sequelize.STRING(191),
        unique: true
      },
      temp_token: {
        type: Sequelize.STRING
      },
      verify_token: {
        type: Sequelize.STRING
      },
      verify_at: {
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
    }).then(() => queryInterface.addIndex('members', [
      'email'
    ])).then(() => queryInterface.addIndex('members', [
      'researcher_id'
    ])).then(() => queryInterface.addIndex('members', [
      'data_privacy_id'
    ])).then(() => queryInterface.addIndex('members', [
      'organization_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('members')
  }
}
