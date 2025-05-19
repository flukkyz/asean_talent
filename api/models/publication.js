'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {
    static associate (models) {
      this.belongsTo(models.Currency, {
        foreignKey: 'currency_id'
      })
      this.belongsTo(models.Journal, {
        foreignKey: 'journal_id'
      })
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  Publication.init({
    name: DataTypes.STRING,
    important: DataTypes.TEXT,
    description: DataTypes.TEXT,
    website: DataTypes.STRING,
    topic: DataTypes.TEXT,
    contact_person: DataTypes.STRING,
    contact_phone: DataTypes.STRING,
    email: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    budget: DataTypes.DOUBLE,
    budget_detail: DataTypes.TEXT,
    currency_id: DataTypes.INTEGER,
    frequency_publish: DataTypes.INTEGER,
    journal_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER,
    deadline_date: DataTypes.DATEONLY,
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
    tableName: 'publications',
    modelName: 'Publication'
  })
  Publication.inputSchema = {
    name: 'required'
  }
  Publication.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Publication
}
