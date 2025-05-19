'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class AseanNetwork extends Model {
    static associate (models) {
      this.belongsTo(models.NetworkType, {
        foreignKey: 'network_type_id'
      })
    }
  }
  AseanNetwork.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.TEXT,
    network_type_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'asean_networks',
    modelName: 'AseanNetwork'
  })
  AseanNetwork.inputSchema = {
    name: 'required'
  }
  return AseanNetwork
}
