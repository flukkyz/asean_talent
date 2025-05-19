'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Publisher extends Model {
    static associate (models) {
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.hasMany(models.Journal, {
        foreignKey: 'publisher_id'
      })
    }
  }
  Publisher.init({
    name: DataTypes.STRING,
    country_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'publishers',
    modelName: 'Publisher'
  })
  Publisher.inputSchema = {
    name: 'required'
  }
  return Publisher
}
