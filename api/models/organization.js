'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    static associate (models) {
      this.hasOne(models.Member, {
        foreignKey: 'organization_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.belongsTo(models.OrganizationType, {
        foreignKey: 'organization_type_id'
      })
    }
  }
  Organization.init({
    name: DataTypes.STRING,
    organization_type_id: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    product: DataTypes.TEXT,
    research_area: DataTypes.TEXT,
    contact_name: DataTypes.STRING,
    contact_email: DataTypes.STRING,
    department: DataTypes.STRING,
    address: DataTypes.TEXT,
    zipcode: DataTypes.TEXT,
    link_linkedin: DataTypes.STRING,
    patient: DataTypes.STRING,
    country_id: DataTypes.INTEGER,
    city: DataTypes.STRING
  }, {
    sequelize,
    underscored: true,
    tableName: 'organizations',
    modelName: 'Organization'
  })
  Organization.inputSchema = {
    name: 'required'
  }
  return Organization
}
