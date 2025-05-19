'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class FundingOrganization extends Model {
    static associate (models) {
      this.belongsTo(models.Currency, {
        foreignKey: 'currency_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.belongsTo(models.Department, {
        foreignKey: 'department_id'
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
  FundingOrganization.init({
    name: DataTypes.STRING,
    department: DataTypes.STRING,
    department_id: DataTypes.INTEGER,
    website: DataTypes.STRING,
    contact_person: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    email: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    description: DataTypes.TEXT,
    min_budget: DataTypes.DOUBLE,
    budget: DataTypes.DOUBLE,
    max_budget: DataTypes.DOUBLE,
    currency_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    organization_type_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
    open_date: DataTypes.DATEONLY,
    deadline_date: DataTypes.DATEONLY,
    eligibility: DataTypes.TEXT,
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
    tableName: 'funding_organizations',
    modelName: 'FundingOrganization'
  })
  FundingOrganization.inputSchema = {
    name: 'required'
  }
  FundingOrganization.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return FundingOrganization
}
