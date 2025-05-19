'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate (models) {
      this.hasMany(models.FundingOrganization, {
        foreignKey: 'department_id'
      })
    }
  }
  Department.init({
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE
  }, {
    sequelize,
    timestamps: false,
    tableName: 'departments',
    modelName: 'Department'
  })
  Department.inputSchema = {
    name: 'required'
  }
  return Department
}
