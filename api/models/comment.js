'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate (models) {
      this.belongsTo(models.Forum, {
        foreignKey: 'forum_id'
      })
      this.belongsTo(models.Member, {
        foreignKey: 'member_id'
      })
      this.hasMany(models.Comment, {
        foreignKey: 'reply_id'
      })
      this.hasMany(models.CommentLog, {
        foreignKey: 'comment_id'
      })
    }
  };
  Comment.init({
    forum_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT('long'),
    reply_id: DataTypes.INTEGER,
    member_id: DataTypes.INTEGER,
    edited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'comments',
    modelName: 'Comment'
  })
  Comment.inputSchema = {
    comment: 'required'
  }
  return Comment
}
