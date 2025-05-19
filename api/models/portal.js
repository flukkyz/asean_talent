'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Portal extends Model {
    static associate (models) {
    }
  }
  Portal.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.TEXT
  }, {
    sequelize,
    timestamps: false,
    tableName: 'portals',
    modelName: 'Portal'
  })
  Portal.inputSchema = {
    name: 'required'
  }
  return Portal
}
