'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class OrganizationType extends Model {
    static associate (models) {
      this.hasMany(models.MatchCompany, {
        foreignKey: 'organization_type_id'
      })
      this.hasMany(models.FundingOrganization, {
        foreignKey: 'organization_type_id'
      })
      this.hasMany(models.Organization, {
        foreignKey: 'organization_type_id'
      })
      this.hasMany(models.LabLocation, {
        foreignKey: 'organization_type_id'
      })
    }
  }
  OrganizationType.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'organization_types',
    modelName: 'OrganizationType'
  })
  OrganizationType.inputSchema = {
    name: 'required'
  }
  return OrganizationType
}
