'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LabLocation extends Model {
    static associate (models) {
      this.hasMany(models.MachineDetail, {
        foreignKey: 'lab_location_id'
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
  LabLocation.init({
    name: DataTypes.STRING,
    lab_link: DataTypes.STRING,
    contact_person: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    university_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    organization_type_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
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
    tableName: 'lab_locations',
    modelName: 'LabLocation'
  })
  LabLocation.inputSchema = {
    name: 'required'
  }
  LabLocation.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return LabLocation
}
