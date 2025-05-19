'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class IndexStandardJournal extends Model {
    static associate (models) {
      this.belongsTo(models.IndexStandard, {
        foreignKey: 'index_standard_id'
      })
      this.belongsTo(models.Journal, {
        foreignKey: 'journal_id'
      })
    }
  }
  IndexStandardJournal.init({
    index_standard_id: DataTypes.INTEGER,
    journal_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'index_standard_journals',
    modelName: 'IndexStandardJournal'
  })
  return IndexStandardJournal
}
