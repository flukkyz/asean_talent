const { Validator } = require('node-input-validator')
const db = require('../models')
const { model } = require('../helpers')
const Op = db.Sequelize.Op
const Publisher = db.Publisher
const Country = db.Country

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Publisher.inputSchema)
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
    try {
      const data = await Publisher.count()
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
    if (req.user.role === 'country_admin') {
      where = {
        ...where,
        ...{ country_id: req.user.country_id }
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              name: {
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
      const lists = await Publisher.findAndCountAll({
        include: [
          Country
        ],
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ['id', 'desc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  store: async (req, res, next) => {
    const data = req.body
    try {
      const newData = await db.sequelize.transaction((t) => {
        if (data.country) {
          data.Country = {
            name: data.country
          }
        }
        return Publisher.create(data, {
          include: [
            Country
          ],
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      e.message = 'Cannot store data from database.'
      next(e)
    }
  },
  storeList: async (req, res, next) => {
    const data = req.body
    try {
      await db.sequelize.transaction((t) => {
        return Publisher.bulkCreate(data.lists, {
          transaction: t
        })
      })
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot store data from database.'
      next(e)
    }
  },
  show: async (req, res, next) => {
    const id = req.params.id
    try {
      const data = await model.findByPk(Publisher, id, res, [Country], null)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Publisher, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      await db.sequelize.transaction(async (t) => {
        if (data.country) {
          const newData = await Country.create({
            name: data.country
          })
          data.country_id = newData.id
        }
        return Publisher.update(
          data, {
            where: {
              id
            }
          }, {
            transaction: t
          }
        )
      })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot update data from database.'
      next(e)
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(Publisher, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
