'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class DomainIndustry extends Model {
    static associate (models) {
      this.hasMany(models.Scopus, {
        foreignKey: 'domain_industry_id'
      })
      this.hasMany(models.IndustryKeyword, {
        foreignKey: 'domain_industry_id'
      })
      this.belongsToMany(models.ListKeyword, {
        through: models.IndustryKeyword,
        foreignKey: 'domain_industry_id',
        otherKey: 'list_keyword_id'
      })
    }
  }
  DomainIndustry.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'domain_industries',
    modelName: 'DomainIndustry'
  })
  return DomainIndustry
}
