'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CoAuthor extends Model {
    static associate (models) {
      this.belongsTo(models.Talent, {
        foreignKey: 'talent_id'
      })
      this.hasMany(models.Collaboration, {
        foreignKey: 'co_author_id'
      })
    }
  }
  CoAuthor.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    talent_id: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    tableName: 'co_authors',
    modelName: 'CoAuthor'
  })
  return CoAuthor
}
