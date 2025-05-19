'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Scopus extends Model {
    static associate (models) {
      this.belongsTo(models.Talent, {
        foreignKey: 'talent_id'
      })
      this.belongsTo(models.DomainIndustry, {
        foreignKey: 'domain_industry_id'
      })
      this.hasMany(models.Keyword, {
        foreignKey: 'scopus_id'
      })
    }
  }
  Scopus.init({
    scopus_id: DataTypes.STRING,
    keyword: DataTypes.TEXT,
    scholarly_output: DataTypes.INTEGER,
    most_recent_pub: DataTypes.STRING,
    citation: DataTypes.INTEGER,
    citation_per_pub: DataTypes.DOUBLE,
    fwci: DataTypes.DOUBLE,
    h_index: DataTypes.INTEGER,
    citation_count: DataTypes.INTEGER,
    cited_by_count: DataTypes.INTEGER,
    document_count: DataTypes.INTEGER,
    no_of_coauthor: DataTypes.INTEGER,
    talent_id: DataTypes.INTEGER,
    domain_industry: DataTypes.TEXT,
    domain_industry_id: DataTypes.INTEGER
  }, {
    sequelize,
    underscored: true,
    tableName: 'scopuses',
    modelName: 'Scopus'
  })
  Scopus.inputSchema = {
    scopus_id: 'required'
  }
  return Scopus
}
