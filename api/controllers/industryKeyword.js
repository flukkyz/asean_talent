const db = require('../models')
const Op = db.Sequelize.Op
const ListKeyword = db.ListKeyword
const IndustryKeyword = db.IndustryKeyword

module.exports = {
  index: async (req, res, next) => {
    const {
      page,
      size,
      order,
      q,
      domain_industry_id,
      group
    } = req.query

    let where = {}

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              '$ListKeyword.keyword$': {
                [Op.like]: `%${q}%`
              }
            }
          ]
        }
      }
    }
    if (domain_industry_id) {
      where = {
        ...where,
        domain_industry_id: Number.parseInt(domain_industry_id)
      }
    }
    if (group) {
      where = {
        ...where,
        talent_group: group
      }
    }
    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await IndustryKeyword.findAndCountAll({
        where,
        limit,
        offset,
        subQuery: false,
        include: [
          {
            model: ListKeyword,
            required: true
          }
        ],
        distinct: true,
        order: [
          [(order || 'weight'), 'desc'],
          [{ model: ListKeyword }, 'keyword', 'asc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
