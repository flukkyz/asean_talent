const db = require("../models");
const QueryTypes = db.Sequelize.QueryTypes;

module.exports = {
  countTalentGroupIndustry: async (req, res, next) => {
    const { industry, q, country, group } = req.query;
    let whereIndustry = "";
    let whereTalent = "";
    let whereListKeyword = "";
    const bindVal = {};
    if (industry) {
      whereIndustry = "and domain_industries.name = $industry ";
      bindVal.industry = industry;
    }
    if (q) {
      whereTalent += `and exists (
        select 1
        from keywords
        where keywords.scopus_id = scopuses.id
        and keywords.keyword like $keyword
      ) `;
      whereListKeyword += "where keyword like $keyword ";
      bindVal.keyword = `%${q}%`;
    }
    if (country) {
      const findCountry = await db.Country.findOne({
        where: {
          name: country,
        },
      });
      if (!findCountry) {
        return res.status(404).json({
          message: "Not Found",
        });
      }
      whereTalent += "and talents.country_id = $country ";
      bindVal.country = findCountry.id;
    }
    if (group) {
      whereTalent += "and talents.talent_group = $group ";
      bindVal.group = group;
    }

    const sql = `
              select
              industry_stats.domain_industry_id,
              industry_stats.name,
              industry_stats.countTalents,
              industry_stats.countCountries,
              keyword_counts.countKeywords
              from
              (
                SELECT
                domain_industries.id as domain_industry_id,
                domain_industries.name,
                count(distinct talents.id) as countTalents,
                count(distinct countries.id) as countCountries
                from domain_industries
                inner join scopuses
                on scopuses.domain_industry like concat('%', domain_industries.name, '%')
                inner join talents
                on scopuses.talent_id = talents.id
                left join countries
                on talents.country_id = countries.id
                where 1=1
                ${whereIndustry}
                ${whereTalent}
                group by domain_industries.id, domain_industries.name
              ) as industry_stats
              inner join
              (
                select
                industry_keywords.domain_industry_id,
                count(industry_keywords.id) as countKeywords
                from industry_keywords
                inner join list_keywords
                on industry_keywords.list_keyword_id = list_keywords.id
                ${whereListKeyword}
                group by industry_keywords.domain_industry_id
              ) as keyword_counts
              on industry_stats.domain_industry_id = keyword_counts.domain_industry_id
              order by industry_stats.name`;
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT,
      });
      return res.json(query);
    } catch (e) {
      e.message = "Cannot get data from database. Error: " + e;
      next(e);
    }
  },
  countTalentGroupCountry: async (req, res, next) => {
    const { industry, group } = req.query;
    let where = "";
    let whereGroup = "";
    const bindVal = {};
    if (industry) {
      where = " and scopuses.domain_industry like $domain_industry ";
      bindVal.domain_industry = `%${industry}%`;
    }
    if (group) {
      whereGroup += "and talents.talent_group = $group ";
      bindVal.group = group;
    }
    const sql = `SELECT
                countries.name as name,
                countries.iso2 as iso2,
                case
                when countries.hc_key = '' or countries.hc_key is null then 'blank'
                else countries.hc_key
                end as hc_key,
                count(distinct scopuses.talent_id) as count
                from scopuses
                inner join talents
                on scopuses.talent_id = talents.id
                left join countries
                on talents.country_id = countries.id
                where 1=1
                ${where}
                ${whereGroup}
                group by talents.country_id, countries.name, countries.iso2, countries.hc_key`;
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT,
      });
      return res.json(query);
    } catch (e) {
      e.message = "Cannot get data from database. Error: " + e;
      next(e);
    }
  },
  countTalentGroupIndustryAndCountry: async (req, res, next) => {
    const { group } = req.query;
    let whereGroup = "";
    const bindVal = {};
    if (group) {
      whereGroup += "where talents.talent_group = $group ";
      bindVal.group = group;
    }
    const sql = `SELECT
                countries.name as country,
                countries.iso2 as iso2,
                domain_industries.name as industry,
                count(distinct scopuses.talent_id) as count
                from scopuses
                inner join talents
                on scopuses.talent_id = talents.id
                inner join domain_industries
                on scopuses.domain_industry like concat('%', domain_industries.name, '%')
                left join countries
                on talents.country_id = countries.id
                ${whereGroup}
                group by talents.country_id, countries.name, countries.iso2, domain_industries.name`;
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT,
      });
      return res.json(query);
    } catch (e) {
      e.message = "Cannot get data from database. Error: " + e;
      next(e);
    }
  },
};
