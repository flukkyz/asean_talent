'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class DataPrivacy extends Model {
    static associate (models) {
      this.hasOne(models.Member, {
        foreignKey: 'organization_id'
      })
    }
  }
  DataPrivacy.init({
    gender: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    name: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    email: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    organization: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    education_info: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    researcher_info: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'data_privacies',
    modelName: 'DataPrivacy'
  })
  return DataPrivacy
}
