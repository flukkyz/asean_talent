'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Slide extends Model {
    static associate (models) {
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  Slide.init({
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
    tableName: 'slides',
    modelName: 'Slide'
  })
  Slide.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Slide
}
