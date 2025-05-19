'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class ListKeyword extends Model {
    static associate (models) {
      this.hasMany(models.IndustryKeyword, {
        foreignKey: 'list_keyword_id'
      })
      this.belongsToMany(models.DomainIndustry, {
        through: models.IndustryKeyword,
        foreignKey: 'list_keyword_id',
        otherKey: 'domain_industry_id'
      })
    }
  }
  ListKeyword.init({
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    hooks: {
      beforeDestroy: async (model, options) => {
        await sequelize.models.IndustryKeyword.destroy({
          where: {
            list_keyword_id: model.id
          }
        })
      }
    },
    sequelize,
    timestamps: false,
    tableName: 'list_keywords',
    modelName: 'ListKeyword'
  })
  ListKeyword.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return ListKeyword
}
