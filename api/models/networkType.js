'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class NetworkType extends Model {
    static associate (models) {
      this.hasMany(models.AseanNetwork, {
        foreignKey: 'network_type_id'
      })
    }
  }
  NetworkType.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'network_types',
    modelName: 'NetworkType'
  })
  NetworkType.inputSchema = {
    name: 'required'
  }
  return NetworkType
}
