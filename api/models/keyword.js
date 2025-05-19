'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Keyword extends Model {
    static associate (models) {
      this.belongsTo(models.Scopus, {
        foreignKey: 'scopus_id'
      })
    }
  }
  Keyword.init({
    keyword: DataTypes.TEXT,
    scopus_id: DataTypes.INTEGER,
    domain_industry_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'keywords',
    modelName: 'Keyword'
  })
  Keyword.inputSchema = {
    keyword: 'required'
  }
  return Keyword
}
