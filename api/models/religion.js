'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Religion extends Model {
    static associate (models) {
      this.hasMany(models.Talent, {
        foreignKey: 'religion_id'
      })
    }
  }
  Religion.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'religions',
    modelName: 'Religion'
  })
  Religion.inputSchema = {
    name: 'required'
  }
  return Religion
}
