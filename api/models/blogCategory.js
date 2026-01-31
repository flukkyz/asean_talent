'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class BlogCategory extends Model {
    static associate (models) {
      this.hasMany(models.Blog, {
        foreignKey: 'blog_category_id'
      })
    }
  }
  BlogCategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    tableName: 'blog_categories',
    modelName: 'BlogCategory'
  })
  BlogCategory.inputSchema = {
    name: 'required'
  }
  return BlogCategory
}
