'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class MatchCompany extends Model {
    static associate (models) {
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.belongsTo(models.City, {
        foreignKey: 'city_id'
      })
      this.belongsTo(models.OrganizationType, {
        foreignKey: 'organization_type_id'
      })
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  MatchCompany.init({
    name: DataTypes.STRING,
    website: DataTypes.STRING,
    email: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    product: DataTypes.TEXT,
    size: DataTypes.INTEGER,
    address: DataTypes.TEXT,
    contact_person: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    social_media_url: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    organization_type_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    expired_at: DataTypes.DATE
  }, {
    hooks: {
      beforeDestroy: async (model, options) => {
        const oldImg = await model.getImg()
        if (oldImg) {
          oldImg.destroy()
        }
      }
    },
    sequelize,
    underscored: true,
    tableName: 'match_companies',
    modelName: 'MatchCompany'
  })
  MatchCompany.inputSchema = {
    name: 'required'
  }
  MatchCompany.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return MatchCompany
}
