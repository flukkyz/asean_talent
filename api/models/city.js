'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    static associate (models) {
      this.hasMany(models.Talent, {
        foreignKey: 'city_id'
      })
      this.hasMany(models.MatchCompany, {
        foreignKey: 'city_id'
      })
      this.hasMany(models.FundingOrganization, {
        foreignKey: 'city_id'
      })
      this.hasMany(models.LabLocation, {
        foreignKey: 'city_id'
      })
    }
  }
  City.init({
    name: DataTypes.STRING,
    hc_key: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE
  }, {
    sequelize,
    timestamps: false,
    tableName: 'cities',
    modelName: 'City'
  })
  City.inputSchema = {
    name: 'required'
  }
  return City
}
