'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Talent extends Model {
    static associate (models) {
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'domicile_id',
        as: 'Domicile'
      })
      this.belongsTo(models.City, {
        foreignKey: 'city_id'
      })
      this.belongsTo(models.University, {
        foreignKey: 'university_id'
      })
      this.belongsTo(models.Religion, {
        foreignKey: 'religion_id'
      })
      this.hasMany(models.Collaboration, {
        foreignKey: 'talent_id'
      })
      this.hasMany(models.CoAuthor, {
        foreignKey: 'talent_id'
      })
      this.hasMany(models.Scopus, {
        foreignKey: 'talent_id'
      })
      this.belongsTo(models.Img, {
        foreignKey: 'img_id'
      })
    }
  }
  Talent.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM('Male', 'Female'),
      defaultValue: 'Male'
    },
    link_linkedin: DataTypes.STRING,
    research_gate: DataTypes.STRING,
    link_tnrr: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    domicile_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    city_id: DataTypes.INTEGER,
    university_id: DataTypes.INTEGER,
    religion_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER,
    hit_scopus: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    hit_linkedin: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    hit_research_gate: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    hit_link_tnrr: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    talent_group: {
      type: DataTypes.ENUM('talent', 'young_talent'),
      defaultValue: 'talent'
    }
  }, {
    hooks: {
      beforeDestroy: async (blog, options) => {
        const oldImg = await blog.getImg()
        if (oldImg) {
          oldImg.destroy()
        }
      }
    },
    sequelize,
    underscored: true,
    tableName: 'talents',
    modelName: 'Talent'
  })
  Talent.inputSchema = {
    firstname: 'required',
    lastname: 'required'
  }
  Talent.beforeBulkDestroy(function (options) {
    options.individualHooks = true
    return options
  })
  return Talent
}
