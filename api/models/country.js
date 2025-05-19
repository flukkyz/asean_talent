'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate (models) {
      this.hasMany(models.Talent, {
        foreignKey: 'country_id'
      })
      this.hasMany(models.MatchCompany, {
        foreignKey: 'country_id'
      })
      this.hasMany(models.FundingOrganization, {
        foreignKey: 'country_id'
      })
      this.hasMany(models.LabLocation, {
        foreignKey: 'country_id'
      })
      this.hasMany(models.Publisher, {
        foreignKey: 'country_id'
      })
    }
  }
  Country.init({
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
    hc_key: DataTypes.STRING,
    country_abbrev: DataTypes.STRING,
    region: DataTypes.STRING,
    sub_region: DataTypes.STRING,
    iso3: DataTypes.STRING,
    iso2: DataTypes.STRING,
    continent: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'countries',
    modelName: 'Country'
  })
  Country.inputSchema = {
    name: 'required'
  }
  return Country
}
