'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CommentLog extends Model {
    static associate (models) {
      this.belongsTo(models.Comment, {
        foreignKey: 'comment_id'
      })
    }
  };
  CommentLog.init({
    comment_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT('long')
  }, {
    sequelize,
    underscored: true,
    tableName: 'comment_logs',
    modelName: 'CommentLog'
  })
  return CommentLog
}
