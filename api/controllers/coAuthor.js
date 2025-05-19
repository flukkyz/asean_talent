const { Validator } = require('node-input-validator')
const db = require('../models')
const { model } = require('../helpers')
const Op = db.Sequelize.Op
const CoAuthor = db.CoAuthor
const Collaboration = db.Collaboration

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, CoAuthor.inputSchema)
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
      const data = await CoAuthor.count()
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
      q,
      not
    } = req.query

    let where = {}
    if (not) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              talent_id: {
                [Op.not]: not
              }
            },
            {
              talent_id: {
                [Op.is]: null
              }
            }
          ]
        }
      }
    }
    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              firstname: {
                [Op.like]: `%${q}%`
              }
            },
            {
              lastname: {
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
      const lists = await CoAuthor.findAndCountAll({
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ['firstname', 'asc'],
          ['lastname', 'asc']
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
        return CoAuthor.create(data, {
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
        return CoAuthor.bulkCreate(data.lists, {
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
      const data = await model.findByPk(CoAuthor, id, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      await db.sequelize.transaction((t) => {
        return CoAuthor.update(
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
    const oldData = await model.findByPk(CoAuthor, id, res)
    try {
      await Collaboration.destroy({
        where: {
          co_author_id: id
        }
      })
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
