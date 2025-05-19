'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class TrainingCourse extends Model {
    static associate (models) {
      this.belongsTo(models.Currency, {
        foreignKey: 'currency_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.belongsTo(models.University, {
        foreignKey: 'university_id'
      })
      this.belongsTo(models.City, {
        foreignKey: 'city_id'
      })
      this.belongsTo(models.OrganizationType, {
        foreignKey: 'organization_type_id'
      })
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  TrainingCourse.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    format: {
      type: DataTypes.ENUM('onsite', 'online', 'hybrid'),
      defaultValue: 'onsite'
    },
    instructor_name: DataTypes.STRING,
    start_date: DataTypes.DATE,
    detail_date: DataTypes.TEXT,
    cost: DataTypes.DOUBLE,
    currency_id: DataTypes.INTEGER,
    place: DataTypes.TEXT,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    university_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    organization_type_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER,
    hit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
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
    tableName: 'training_courses',
    modelName: 'TrainingCourse'
  })
  TrainingCourse.inputSchema = {
    name: 'required'
  }
  TrainingCourse.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return TrainingCourse
}
