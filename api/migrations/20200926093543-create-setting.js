'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('setting', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      home_header_title: {
        type: Sequelize.STRING
      },
      home_header_detail: {
        type: Sequelize.TEXT
      },
      website_name: {
        type: Sequelize.TEXT
      },
      contact_name: {
        type: Sequelize.TEXT
      },
      contact_office: {
        type: Sequelize.TEXT
      },
      contact_address: {
        type: Sequelize.TEXT
      },
      contact_tel: {
        type: Sequelize.STRING
      },
      contact_fax: {
        type: Sequelize.STRING
      },
      contact_email: {
        type: Sequelize.STRING
      },
      contact_map_url: {
        type: Sequelize.STRING
      },
      facebook_page_url: {
        type: Sequelize.STRING
      },
      about_page: {
        type: Sequelize.TEXT('long')
      },
      member_notice: {
        type: Sequelize.TEXT('long')
      },
      pdpa: {
        type: Sequelize.TEXT
      },
      popup_content: {
        type: Sequelize.TEXT('long')
      },
      popup_show: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      popup_close: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_home_blog: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_home_pool: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_dashboard: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_dashboard_overview: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_dashboard_summary_industry: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_dashboard_keyword: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_dashboard_country_industry: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_dashboard_country: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_talent_pool: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_asean_talent: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_young_talent: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_paring_search: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse_publication: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse_training_course: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse_funding_organization: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse_host: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse_lab_location: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_resourse_forum: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      show_menu_asean_network: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('setting')
  }
}
