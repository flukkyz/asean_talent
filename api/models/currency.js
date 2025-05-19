'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    static associate (models) {
    }
  }
  Currency.init({
    code: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'currencies',
    modelName: 'Currency'
  })
  Currency.inputSchema = {
    name: 'required'
  }
  return Currency
}
