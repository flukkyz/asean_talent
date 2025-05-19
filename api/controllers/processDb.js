const _ = require('lodash')
const db = require('../models')
const Scopus = db.Scopus
const Keyword = db.Keyword

module.exports = {
  index: async (req, res, next) => {
    try {
      const lists = await Scopus.findAll({ include: [Keyword] })
      for await (const item of lists) {
        await db.Scopus.update({
          keyword: _.uniq([].concat(item.Keywords.map(ele => ele.keyword))).join('; ')
        },
        {
          where: {
            id: item.id
          }
        }
        )
      }
      return res.json({ status: 'OK' })
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
