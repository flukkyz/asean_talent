const { Validator } = require('node-input-validator')
const db = require('../models')
const { model } = require('../helpers')
const Op = db.Sequelize.Op
const DomainIndustry = db.DomainIndustry
const ListKeyword = db.ListKeyword
const IndustryKeyword = db.IndustryKeyword

const findByName = async (name, res, include = []) => {
  const where = {
    name
  }
  const data = await DomainIndustry.findOne({
    where,
    include
  })
  return data || res.status(404).json({
    message: 'Not Found'
  })
}

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, DomainIndustry.inputSchema)
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
      const data = await DomainIndustry.count()
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
      keyword
    } = req.query

    let where = {}

    const include = []
    if (keyword) {
      include.push({
        model: ListKeyword,
        order: [
          ['weight', 'desc'],
          ['keyword', 'asc']
        ]
      })
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

    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await DomainIndustry.findAndCountAll({
        include,
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
  store: async (req, res, next) => {
    const data = req.body
    try {
      const newData = await db.sequelize.transaction((t) => {
        return DomainIndustry.create(data, {
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
        return DomainIndustry.bulkCreate(data.lists, {
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
      const data = await model.findByPk(DomainIndustry, id, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  showName: async (req, res, next) => {
    const slug = req.params.slug
    try {
      const data = await findByName(slug, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  showWithKeyword: async (req, res, next) => {
    const id = req.params.id
    try {
      const data = await model.findByPk(DomainIndustry, id, res, [
        {
          model: ListKeyword,
          order: [
            ['weight', 'desc'],
            ['keyword', 'asc']
          ]
        }
      ])
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
        return DomainIndustry.update(
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
    const oldData = await model.findByPk(DomainIndustry, id, res)
    try {
      await IndustryKeyword.destroy({
        where: {
          domain_industry_id: id
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
