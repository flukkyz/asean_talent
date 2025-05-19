'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    static associate (models) {
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  Banner.init({
    img_id: DataTypes.INTEGER,
    link: DataTypes.STRING
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
    timestamps: false,
    tableName: 'banners',
    modelName: 'Banner'
  })
  Banner.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Banner
}
