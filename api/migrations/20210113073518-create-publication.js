'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('publications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      important: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      website: {
        type: Sequelize.STRING
      },
      topic: {
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
      keyword: {
        type: Sequelize.TEXT
      },
      budget: {
        type: Sequelize.DOUBLE
      },
      budget_detail: {
        type: Sequelize.TEXT
      },
      currency_id: {
        type: Sequelize.INTEGER
      },
      frequency_publish: {
        type: Sequelize.INTEGER
      },
      journal_id: {
        type: Sequelize.INTEGER
      },
      img_id: {
        type: Sequelize.INTEGER
      },
      deadline_date: {
        type: Sequelize.DATEONLY
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
    }).then(() => queryInterface.addIndex('publications', [
      'journal_id'
    ])).then(() => queryInterface.addIndex('publications', [
      'currency_id'
    ])).then(() => queryInterface.addIndex('publications', [
      'img_id'
    ]))
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('publications')
  }
}
