'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Support extends Model {
    static associate (models) {
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  Support.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    url: DataTypes.STRING,
    img_id: DataTypes.INTEGER,
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
    tableName: 'supports',
    modelName: 'Support'
  })
  Support.inputSchema = {
    url: 'required'
  }
  Support.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Support
}
