const { Validator } = require('node-input-validator')
const db = require('../models')
const { file, model } = require('../helpers')
const Op = db.Sequelize.Op
const AseanNetwork = db.AseanNetwork
const NetworkType = db.NetworkType

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, AseanNetwork.inputSchema)
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
      const data = await AseanNetwork.count()
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
      networkType
    } = req.query

    let where = {}
    if (networkType) {
      where = {
        ...where,
        ...{ network_type_id: networkType }
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
            },
            {
              description: {
                [Op.like]: `%${q}%`
              }
            },
            {
              url: {
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
      const lists = await AseanNetwork.findAndCountAll({
        include: [
          NetworkType
        ],
        where,
        limit,
        offset,
        distinct: true,
        order: [
          // ['id', 'desc']
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
        if (data.networkType) {
          data.NetworkType = {
            name: data.networkType
          }
        }
        return AseanNetwork.create(data, {
          include: [
            NetworkType
          ],
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      file.removeTmpFile(req)
      e.message = 'Cannot store data from database.'
      next(e)
    }
  },
  storeList: async (req, res, next) => {
    const data = req.body
    try {
      await db.sequelize.transaction((t) => {
        return AseanNetwork.bulkCreate(data.lists, {
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
      const data = await model.findByPk(AseanNetwork, id, res, [NetworkType], null, { active: true })
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
      await db.sequelize.transaction(async (t) => {
        if (data.networkType) {
          const newData = await NetworkType.create({
            name: data.networkType
          })
          data.network_type_id = newData.id
        }
        return AseanNetwork.update(
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
      file.removeTmpFile(req)
      e.message = 'Cannot update data from database.'
      next(e)
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(AseanNetwork, id, res)
    try {
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
