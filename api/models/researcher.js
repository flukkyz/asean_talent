'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Researcher extends Model {
    static associate (models) {
      this.hasOne(models.Member, {
        foreignKey: 'researcher_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'country_id'
      })
      this.belongsTo(models.Country, {
        foreignKey: 'graduate_country_id',
        as: 'GraduateCountry'
      })
    }
  }
  Researcher.init({
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Unspecified'),
      defaultValue: 'Male'
    },
    title: DataTypes.STRING,
    firstname: DataTypes.STRING,
    middlename: DataTypes.STRING,
    lastname: DataTypes.STRING,
    department: DataTypes.STRING,
    organization: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    expert: DataTypes.TEXT,
    case_study: DataTypes.TEXT,
    research_country: DataTypes.TEXT,
    length: DataTypes.INTEGER,
    graduate: DataTypes.TEXT,
    hot_issue: DataTypes.TEXT,
    graduate_country_id: DataTypes.INTEGER,
    religion: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    link_scopus: DataTypes.STRING,
    link_linkedin: DataTypes.STRING,
    research_gate: DataTypes.STRING,
    cv: DataTypes.STRING,
    patient: DataTypes.STRING,
    address: DataTypes.TEXT,
    country_id: DataTypes.INTEGER,
    city: DataTypes.STRING,
    no_of_coauthor: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: true,
    tableName: 'researchers',
    modelName: 'Researcher'
  })
  Researcher.inputSchema = {
    firstname: 'required',
    lastname: 'required'
  }
  return Researcher
}
