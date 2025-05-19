'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class IndustryKeyword extends Model {
    static associate (models) {
      this.belongsTo(models.ListKeyword, {
        foreignKey: 'list_keyword_id'
      })
      this.belongsTo(models.DomainIndustry, {
        foreignKey: 'domain_industry_id'
      })
    }
  }
  IndustryKeyword.init({
    list_keyword_id: DataTypes.INTEGER,
    domain_industry_id: DataTypes.INTEGER,
    talent_group: {
      type: DataTypes.ENUM('talent', 'young_talent'),
      defaultValue: 'talent'
    },
    weight: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    hit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    timestamps: false,
    tableName: 'industry_keywords',
    modelName: 'IndustryKeyword'
  })
  return IndustryKeyword
}
