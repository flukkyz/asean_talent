'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model { }
  Setting.init({
    website_name: DataTypes.STRING,
    contact_name: DataTypes.TEXT,
    contact_address: DataTypes.TEXT,
    contact_office: DataTypes.TEXT,
    contact_tel: DataTypes.STRING,
    contact_fax: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    contact_map_url: DataTypes.STRING,
    facebook_page_url: DataTypes.STRING,
    about_page: DataTypes.TEXT('long'),
    member_notice: DataTypes.TEXT('long'),
    pdpa: DataTypes.TEXT,
    popup_content: DataTypes.TEXT('long'),
    popup_show: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    popup_close: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_home_blog: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_home_pool: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_dashboard: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_dashboard_overview: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_dashboard_summary_industry: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_dashboard_keyword: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_dashboard_country_industry: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_dashboard_country: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_talent_pool: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_asean_talent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_young_talent: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_paring_search: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse_publication: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse_training_course: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse_funding_organization: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse_host: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse_lab_location: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_resourse_forum: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    show_menu_asean_network: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'setting',
    modelName: 'Setting'
  })
  return Setting
}
