const _ = require('lodash')
const db = require('../models')
const { model } = require('../helpers')
const QueryTypes = db.Sequelize.QueryTypes

module.exports = {
  searchByKeyword: async (req, res, next) => {
    const { key, slug } = req.params
    const { group } = req.query

    try {
      const domainIndustry = await db.DomainIndustry.findOne({
        where: {
          name: key
        }
      })
      if (!domainIndustry) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      const data = await db.ListKeyword.findOne({
        where: {
          keyword: slug
        },
        include: db.IndustryKeyword
      })
      if (!data) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      const industryKeyword = _.find(data.IndustryKeywords, { domain_industry_id: domainIndustry.id })
      await db.IndustryKeyword.update({
        hit: industryKeyword.hit + 1
      }, {
        where: {
          domain_industry_id: domainIndustry.id,
          list_keyword_id: data.id
        }
      })
      await db.ListKeyword.update({
        hit: data.hit + 1
      }, {
        where: {
          id: data.id
        }
      })
      const bindVal = {
        domainIndustry: `%${domainIndustry.name}%`,
        keyword1: `%; ${data.keyword};%`,
        keyword2: `%;${data.keyword};%`,
        keyword3: `%; ${data.keyword}`,
        keyword4: `%;${data.keyword}`,
        keyword5: `${data.keyword};%`,
        keyword6: `${data.keyword}`
      }

      let whereGroup = ''
      if (group) {
        whereGroup += 'and talents.talent_group = $group '
        bindVal.group = group
      }
      const sql = `SELECT 
                  countries.name as country,
                  h_index,
                  scopuses.scopus_id,
                  link_linkedin,
                  research_gate,
                  link_tnrr,
                  talents.firstname,
                  talents.lastname,
                  scopuses.id as id
                  from keywords
                  INNER join scopuses
                  on keywords.scopus_id = scopuses.id
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  INNER join countries
                  on talents.country_id = countries.id
                  where scopuses.domain_industry like $domainIndustry
                  and 
                  (keywords.keyword like $keyword1
                  or keywords.keyword like $keyword2
                  or keywords.keyword like $keyword3
                  or keywords.keyword like $keyword4
                  or keywords.keyword like $keyword5
                  or keywords.keyword = $keyword6)
                  ${whereGroup}
                  group by talents.id
                  order by h_index desc`
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      return res.json({
        keyword: data.keyword,
        industry: domainIndustry.name,
        rows: query.map((ele, index) => {
          return {
            id: ele.id,
            row: index,
            country: ele.country,
            h_index: ele.h_index,
            firstname: ele.firstname,
            lastname: ele.lastname,
            scopus: !!ele.scopus_id,
            linkedin: !!ele.link_linkedin,
            research_gate: !!ele.research_gate,
            link_tnrr: !!ele.link_tnrr
          }
        })
      })
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  searchByCountryIndustry: async (req, res, next) => {
    const slug = req.params.slug
    const { industry, group } = req.query

    try {
      const country = await db.Country.findOne({
        where: {
          name: slug
        }
      })
      if (!country) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      let where = ' where talents.country_id = $countryId '
      const bindVal = {
        countryId: country.id
      }
      let domainIndustry = null
      if (industry) {
        domainIndustry = await db.DomainIndustry.findOne({
          where: {
            name: industry
          }
        })
        if (!domainIndustry) {
          return res.status(404).json({
            message: 'Not Found'
          })
        }
        where += 'and scopuses.domain_industry like  $domainIndustry'
        bindVal.domainIndustry = `%${domainIndustry.name}%`
      }

      let whereGroup = ''
      if (group) {
        whereGroup += 'and talents.talent_group = $group '
        bindVal.group = group
      }
      const sql = `SELECT 
                  h_index,
                  scopuses.scopus_id,
                  talents.firstname,
                  talents.lastname,
                  link_linkedin,
                  research_gate,
                  link_tnrr,
                  scopuses.id as id
                  from scopuses
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  ${where}
                  ${whereGroup}
                  group by talents.id
                  order by h_index desc`
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      return res.json({
        country,
        domainIndustry,
        rows: query.map((ele, index) => {
          return {
            id: ele.id,
            row: index,
            h_index: ele.h_index,
            firstname: ele.firstname,
            lastname: ele.lastname,
            scopus: !!ele.scopus_id,
            linkedin: !!ele.link_linkedin,
            research_gate: !!ele.research_gate,
            link_tnrr: !!ele.link_tnrr
          }
        })
      })
    } catch (e) {
      e.message = 'Cannot get data from database. Error: '
      next(e)
    }
  },
  getTalentUrl: async (req, res, next) => {
    const key = req.params.key
    const id = req.params.id
    const scopus = await model.findByPk(db.Scopus, id, res, [db.Talent])
    try {
      const newData = {}
      newData[`hit_${key}`] = scopus.Talent[`hit_${key}`] + 1
      await db.Talent.update(newData, {
        where: {
          id: scopus.talent_id
        }
      })
      const bindVal = {
        scopusId: scopus.id
      }
      const sql = `SELECT 
                  scopuses.scopus_id as scopus,
                  link_linkedin as linkedin,
                  research_gate,
                  link_tnrr
                  from scopuses
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  where scopuses.id = $scopusId`
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      let url = ''
      if (key === 'scopus') {
        url = `https://www.scopus.com/authid/detail.url?authorId=${query[0].scopus}`
      } else {
        url = `https://${query[0][key].replace('https://', '')}`
      }
      return res.redirect(url)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: '
      next(e)
    }
  }
}
