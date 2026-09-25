const { Validator } = require("node-input-validator");
const db = require("../models");
const Op = db.Sequelize.Op;
const QueryTypes = db.Sequelize.QueryTypes;
const ListKeyword = db.ListKeyword;
const IndustryKeyword = db.IndustryKeyword;

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, ListKeyword.inputSchema);
    const matched = await v.check();
    if (matched) {
      next();
    } else {
      return res.status(400).json({
        message: "Bad request." + v.errors,
      });
    }
  },
  count: async (req, res, next) => {
    const { domain_industry_id: domainIndustryId, group } = req.query;

    const where = {};
    if (domainIndustryId) {
      where.domain_industry_id = domainIndustryId;
    }
    if (group) {
      where.talent_group = group;
    }
    try {
      const hasIndustryFilter = domainIndustryId || group;
      const data = hasIndustryFilter
        ? await IndustryKeyword.count({
            distinct: true,
            col: "list_keyword_id",
            where,
          })
        : await ListKeyword.count();
      return res.json(data);
    } catch (e) {
      e.message = "Cannot get data from database. Error: " + e;
      next(e);
    }
  },
  index: async (req, res, next) => {
    const { page, size, q } = req.query;

    let where = {};

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              keyword: {
                [Op.like]: `%${q}%`,
              },
            },
          ],
        },
      };
    }
    const { limit, offset } = db.getPagination(page, size);
    try {
      const lists = await ListKeyword.findAndCountAll({
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ["weight", "desc"],
          ["keyword", "asc"],
        ],
      });
      return res.json(db.getPagingData(lists, page, limit));
    } catch (e) {
      e.message = "Cannot get data from database. Error: " + e;
      next(e);
    }
  },
  indexPopular: async (req, res, next) => {
    const {
      page,
      size,
      domain_industry_id: domainIndustryId,
      group,
    } = req.query;

    const { limit, offset } = db.getPagination(page, size);
    try {
      const industryWhere = {};
      const filters = [];
      const bind = { limit, offset };

      if (group) {
        industryWhere.talent_group = group;
        filters.push("talent_group = :group");
        bind.group = group;
      }
      if (domainIndustryId) {
        industryWhere.domain_industry_id = domainIndustryId;
        filters.push("domain_industry_id = :domainIndustryId");
        bind.domainIndustryId = domainIndustryId;
      }

      const hasIndustryFilter = filters.length > 0;
      const countPromise = hasIndustryFilter
        ? IndustryKeyword.count({
            distinct: true,
            col: "list_keyword_id",
            where: industryWhere,
          })
        : ListKeyword.count();
      const join = hasIndustryFilter
        ? `INNER JOIN (
            SELECT DISTINCT list_keyword_id
            FROM industry_keywords
            WHERE ${filters.join(" AND ")}
          ) AS filtered_keywords
          ON filtered_keywords.list_keyword_id = list_keywords.id`
        : "";
      const rowsPromise = db.sequelize.query(
        `
        SELECT
          list_keywords.id,
          list_keywords.keyword,
          list_keywords.weight,
          list_keywords.hit
        FROM list_keywords
        ${join}
        ORDER BY
          list_keywords.hit DESC,
          list_keywords.weight DESC,
          list_keywords.keyword ASC
        LIMIT :limit OFFSET :offset
      `,
        {
          replacements: bind,
          type: QueryTypes.SELECT,
        }
      );
      const [count, rows] = await Promise.all([countPromise, rowsPromise]);
      const lists = { count, rows };
      return res.json(db.getPagingData(lists, page, limit));
    } catch (e) {
      e.message = "Cannot get data from database. Error: " + e;
      next(e);
    }
  },
};
