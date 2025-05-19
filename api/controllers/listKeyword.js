const { Validator } = require('node-input-validator')
const db = require('../models')
const Op = db.Sequelize.Op
const ListKeyword = db.ListKeyword
const IndustryKeyword = db.IndustryKeyword

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, ListKeyword.inputSchema)
    const matched = await v.check()
    if (matched) {
      next()
    } else {
      return res.status(400).json({
        message: 'Bad request.' + v.errors
      })
    }
  },
  count: async (req, res, next) => {
    const {
      domain_industry_id,
      group
    } = req.query

    let where = {}
    if (domain_industry_id) {
      where = {
        ...where,
        '$IndustryKeywords.domain_industry_id$': domain_industry_id
      }
    }
    if (group) {
      where = {
        ...where,
        '$IndustryKeywords.talent_group$': group
      }
    }
    try {
      const data = await ListKeyword.count({
        include: IndustryKeyword,
        distinct: true,
        where
      })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  index: async (req, res, next) => {
    const {
      page,
      size,
      q
    } = req.query

    let where = {}

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              keyword: {
                [Op.like]: `%${q}%`
              }
            }
          ]
        }
      }
    }
    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await ListKeyword.findAndCountAll({
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ['weight', 'desc'],
          ['keyword', 'asc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexPopular: async (req, res, next) => {
    const {
      page,
      size,
      domain_industry_id,
      group
    } = req.query

    let where = {}
    if (domain_industry_id) {
      where = {
        ...where,
        '$IndustryKeywords.domain_industry_id$': domain_industry_id
      }
    }
    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await ListKeyword.findAndCountAll({
        include: {
          model: IndustryKeyword,
          where: { talent_group: group }
        },
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ['hit', 'desc'],
          ['weight', 'desc'],
          ['keyword', 'asc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }

}
