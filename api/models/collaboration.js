'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Collaboration extends Model {
    static associate (models) {
      this.belongsTo(models.Talent, {
        foreignKey: 'talent_id'
      })
      this.belongsTo(models.CoAuthor, {
        foreignKey: 'co_author_id'
      })
    }
  }
  Collaboration.init({
    talent_id: DataTypes.INTEGER,
    co_author_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'collaborations',
    modelName: 'Collaboration'
  })
  return Collaboration
}
