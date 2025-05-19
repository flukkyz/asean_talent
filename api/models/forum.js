'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Forum extends Model {
    static associate (models) {
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
      this.belongsTo(models.Member, {
        foreignKey: 'member_id'
      })
      this.hasMany(models.Comment, {
        foreignKey: 'forum_id'
      })
    }
  };
  Forum.init({
    title: DataTypes.STRING,
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: DataTypes.TEXT('long'),
    tags: DataTypes.TEXT,
    hit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    img_id: DataTypes.INTEGER,
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
    hooks: {
      beforeDestroy: async (model, options) => {
        const oldImg = await model.getImg()
        if (oldImg) {
          oldImg.destroy()
        }
      }
    },
    sequelize,
    underscored: true,
    tableName: 'forums',
    modelName: 'Forum'
  })
  Forum.inputSchema = {
    title: 'required'
  }
  Forum.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Forum
}
