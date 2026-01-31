'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'blogs',
      'blog_category_id',
      Sequelize.INTEGER
    ).then(() => queryInterface.addIndex('blogs', [
      'blog_category_id'
    ]))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('blogs', 'blog_category_id')
  }
}
