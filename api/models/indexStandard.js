'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class IndexStandard extends Model {
    static associate (models) {
      this.hasMany(models.IndexStandardJournal, {
        foreignKey: 'index_standard_id'
      })
      this.belongsToMany(models.Journal, {
        through: models.IndexStandardJournal,
        foreignKey: 'index_standard_id',
        otherKey: 'journal_id'
      })
    }
  }
  IndexStandard.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'index_standards',
    modelName: 'IndexStandard'
  })
  IndexStandard.inputSchema = {
    name: 'required'
  }
  return IndexStandard
}
