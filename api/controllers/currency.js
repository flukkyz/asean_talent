const db = require('../models')
const Op = db.Sequelize.Op
const Currency = db.Currency

module.exports = {
  count: async (req, res, next) => {
    try {
      const data = await Currency.count()
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  index: async (req, res, next) => {
    const {
      q
    } = req.query

    let where = {}

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            { code: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } }
          ]
        }
      }
    }
    try {
      const lists = await Currency.findAll({
        where,
        attributes: {
          exclude: [
            'description'
          ]
        }
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexAsean: async (req, res, next) => {
    const {
      q
    } = req.query

    let where = {
      code: {
        [Op.in]: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW',
          'THB', 'MMK', 'BND', 'KHR', 'IDR',
          'LAK', 'MYR', 'PHP', 'SGD', 'VND']
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            { code: { [Op.like]: `%${q}%` } },
            { description: { [Op.like]: `%${q}%` } }
          ]
        }
      }
    }
    try {
      const lists = await Currency.findAll({
        where,
        attributes: {
          exclude: [
            'description'
          ]
        }
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
