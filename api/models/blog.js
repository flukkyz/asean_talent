'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate (models) {
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
      this.belongsTo(models.BlogCategory, {
        foreignKey: 'blog_category_id'
      })
    }
  };
  Blog.init({
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
    blog_category_id: DataTypes.INTEGER,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    expired_at: DataTypes.DATE
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
    tableName: 'blogs',
    modelName: 'Blog'
  })
  Blog.inputSchema = {
    title: 'required'
  }
  Blog.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Blog
}
