const { Validator } = require('node-input-validator')
const db = require('../models')
const { model } = require('../helpers')
const QueryTypes = db.Sequelize.QueryTypes
const Op = db.Sequelize.Op
const City = db.City

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, City.inputSchema)
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
      const data = await City.count()
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
          name: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await City.findAndCountAll({
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ['name', 'asc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexByTalent: async (req, res, next) => {
    const { q } = req.query

    const query = await db.sequelize.query('SELECT DISTINCT city_id FROM talents', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.city_id)
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          name: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    try {
      const lists = await City.findAll({
        where,
        distinct: true,
        attributes: ['id', 'name'],
        order: [
          ['name', 'asc']
        ]
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexByLab: async (req, res, next) => {
    const { q } = req.query

    const query = await db.sequelize.query('SELECT DISTINCT city_id FROM lab_locations', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.city_id)
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          name: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    try {
      const lists = await City.findAll({
        where,
        distinct: true,
        attributes: ['id', 'name'],
        order: [
          ['name', 'asc']
        ]
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexByTraining: async (req, res, next) => {
    const { q } = req.query

    const query = await db.sequelize.query('SELECT DISTINCT city_id FROM training_courses where active = 1', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.city_id)
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          name: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    try {
      const lists = await City.findAll({
        where,
        distinct: true,
        attributes: ['id', 'name'],
        order: [
          ['name', 'asc']
        ]
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexByFunding: async (req, res, next) => {
    const { q } = req.query

    const query = await db.sequelize.query('SELECT DISTINCT city_id FROM funding_organizations', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.city_id)
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          name: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    try {
      const lists = await City.findAll({
        where,
        distinct: true,
        attributes: ['id', 'name'],
        order: [
          ['name', 'asc']
        ]
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexByHost: async (req, res, next) => {
    const { q } = req.query

    const query = await db.sequelize.query('SELECT DISTINCT city_id FROM hosts', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.city_id)
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          name: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    try {
      const lists = await City.findAll({
        where,
        distinct: true,
        attributes: ['id', 'name'],
        order: [
          ['name', 'asc']
        ]
      })
      return res.json(lists)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  store: async (req, res, next) => {
    const data = req.body
    try {
      const newData = await db.sequelize.transaction((t) => {
        return City.create(data, {
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
        return City.bulkCreate(data.lists, {
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
      const data = await model.findByPk(City, id, res)
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
        return City.update(
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
    const oldData = await model.findByPk(City, id, res)
    try {
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
