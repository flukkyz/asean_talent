'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    static associate (models) {
      this.hasMany(models.Talent, {
        foreignKey: 'university_id'
      })
      this.hasMany(models.LabLocation, {
        foreignKey: 'university_id'
      })
    }
  }
  University.init({
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE
  }, {
    sequelize,
    timestamps: false,
    tableName: 'universities',
    modelName: 'University'
  })
  University.inputSchema = {
    name: 'required'
  }
  return University
}
