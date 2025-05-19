const { Validator } = require('node-input-validator')
const db = require('../models')
const { model } = require('../helpers')
const QueryTypes = db.Sequelize.QueryTypes
const Op = db.Sequelize.Op
const OrganizationType = db.OrganizationType

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, OrganizationType.inputSchema)
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
      const data = await OrganizationType.count()
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
      const lists = await OrganizationType.findAndCountAll({
        where,
        limit,
        offset,
        distinct: true,
        order: [
          ['id', 'asc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexByLab: async (req, res, next) => {
    const { q } = req.query

    const query = await db.sequelize.query('SELECT DISTINCT organization_type_id FROM lab_locations', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.organization_type_id)
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
      const lists = await OrganizationType.findAll({
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

    const query = await db.sequelize.query('SELECT DISTINCT organization_type_id FROM training_courses where active = 1', {
      type: QueryTypes.SELECT
    })
    let where = {
      id: {
        [Op.in]: query.map(ele => ele.organization_type_id)
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
      const lists = await OrganizationType.findAll({
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
        return OrganizationType.create(data, {
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
        return OrganizationType.bulkCreate(data.lists, {
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
      const data = await model.findByPk(OrganizationType, id, res)
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
        return OrganizationType.update(
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
    const oldData = await model.findByPk(OrganizationType, id, res)
    try {
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
