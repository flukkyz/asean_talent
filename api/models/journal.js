'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    static associate (models) {
      this.belongsTo(models.Publisher, {
        foreignKey: 'publisher_id'
      })
      this.hasMany(models.IndexStandardJournal, {
        foreignKey: 'journal_id'
      })
      this.belongsToMany(models.IndexStandard, {
        through: models.IndexStandardJournal,
        foreignKey: 'journal_id',
        otherKey: 'index_standard_id'
      })
      this.hasMany(models.Publication, {
        foreignKey: 'journal_id'
      })
    }
  }
  Journal.init({
    name: DataTypes.STRING,
    publisher_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'journals',
    modelName: 'Journal'
  })
  Journal.inputSchema = {
    name: 'required'
  }
  return Journal
}
