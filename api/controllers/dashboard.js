const db = require('../models')
const QueryTypes = db.Sequelize.QueryTypes

module.exports = {
  countTalentGroupIndustry: async (req, res, next) => {
    const { industry, q, country, group } = req.query
    let where = ''
    const bindVal = {}
    if (industry) {
      where += 'where name = $industry'
      bindVal.industry = industry
    }
    let whereKeyword = ''
    let whereGroup = ''
    let whereCountry = ''
    let whereListKeyword = ''
    if (q) {
      whereKeyword += 'and keywords.keyword like $keyword '
      whereListKeyword += 'where keyword like $keyword '
      bindVal.keyword = `%${q}%`
    }
    if (country) {
      const findCountry = await db.Country.findOne({
        where: {
          name: country
        }
      })
      if (!findCountry) {
        return res.status(404).json({
          message: 'Not Found'
        })
      }
      whereCountry += ' and talents.country_id = $country '
      bindVal.country = findCountry.id
    }
    if (group) {
      whereGroup += 'and talents.talent_group = $group '
      bindVal.group = group
    }

    const sql = `
              select
              industry.id as domain_industry_id,
              industry.name,
              countTalents,
              countCountries,
              countKeywords
              from 
              (select * from domain_industries ${where}) as industry,
              (
                SELECT
                domain_industry_id,
                count(talent_id) as countTalents 
                FROM 
                (
                  select 
                  talent_id,
                  domain_industries.id as domain_industry_id
                  from scopuses
                  INNER join domain_industries
                  on scopuses.domain_industry like concat('%',domain_industries.name,'%')
                  inner join talents 
                  on scopuses.talent_id = talents.id
                  ${whereKeyword ? 'inner join keywords on keywords.scopus_id = scopuses.id ' : ''}
                  where 1=1 
                  ${whereKeyword}
                  ${whereGroup}
                  ${whereCountry}
                  group by domain_industries.name,talent_id
                  ) as talents
                  GROUP by domain_industry_id
                  ) as countT,
                  (
                    SELECT
                    domain_industry_id,
                    count(talent_id) as countCountries
                    FROM 
                    (
                      select 
                      talent_id,
                      country_id,
                      domain_industries.id as domain_industry_id
                  from scopuses
                  INNER join domain_industries
                  on scopuses.domain_industry like concat('%',domain_industries.name,'%')
                  inner join talents
                  on scopuses.talent_id = talents.id
                  inner join countries
                  on talents.country_id = countries.id
                  ${whereKeyword ? 'inner join keywords on keywords.scopus_id = scopuses.id ' : ''}
                  where 1=1 
                  ${whereKeyword}
                  ${whereGroup}
                  ${whereCountry}
                  group by domain_industries.name,country_id
                ) as countries
                GROUP by domain_industry_id
              ) as countC,
              (
                select 
                domain_industry_id,
                count(industry_keywords.id) as countKeywords 
                from industry_keywords 
                INNER join list_keywords
                  on industry_keywords.list_keyword_id = list_keywords.id
                ${whereListKeyword}
                group by domain_industry_id) as countK
              where 
              countT.domain_industry_id = countK.domain_industry_id
              and
              countC.domain_industry_id = countK.domain_industry_id
              and
              industry.id = countK.domain_industry_id
              order by industry.name`
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  countTalentGroupCountry: async (req, res, next) => {
    const { industry, group } = req.query
    let where = ''
    let whereGroup = ''
    const bindVal = {}
    if (industry) {
      where = ' and scopuses.domain_industry like $domain_industry '
      bindVal.domain_industry = `%${industry}%`
    }
    if (group) {
      whereGroup += 'and talents.talent_group = $group '
      bindVal.group = group
    }
    const sql = `SELECT
                countries.name,
                countries.iso2,
                case
                when countries.hc_key = '' or countries.hc_key is null then 'blank'
                else countries.hc_key
                end as hc_key,
                count(talent_id) as count 
                FROM 
                (
                  select 
                  talent_id,
                  country_id
                  from scopuses
                  inner join talents
                  on scopuses.talent_id = talents.id
                  where 1=1 
                  ${where}
                  ${whereGroup}
                  group by talent_id
                ) as talents
                LEFT join countries 
                on talents.country_id = countries.id 
                GROUP by country_id`
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  countTalentGroupIndustryAndCountry: async (req, res, next) => {
    const { group } = req.query
    let whereGroup = ''
    const bindVal = {}
    if (group) {
      whereGroup += 'where talents.talent_group = $group '
      bindVal.group = group
    }
    const sql = `SELECT
                countries.name as country,
                countries.iso2 as iso2,
                industry,
                count(talent_id) as count 
                FROM 
                (
                  select 
                  talent_id,
                  domain_industry_id,
                  domain_industries.name as industry,
                  country_id
                  from scopuses
                  inner join talents
                  on scopuses.talent_id = talents.id
                  INNER join domain_industries
                  on scopuses.domain_industry like concat('%',domain_industries.name,'%')
                  ${whereGroup}
                  group by domain_industries.name,talent_id
                ) as talents
                LEFT join countries 
                on talents.country_id = countries.id 
                GROUP by country_id,industry`
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
