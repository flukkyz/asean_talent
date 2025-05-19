const { Validator } = require('node-input-validator')
const _ = require('lodash')
const db = require('../models')
const { model, keywordWeight } = require('../helpers')
const Op = db.Sequelize.Op
const Keyword = db.Keyword

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Keyword.inputSchema)
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
      const data = await Keyword.count()
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
      const lists = await Keyword.findAndCountAll({
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
        return Keyword.create(data, {
          transaction: t
        })
      })
      const scopus = await model.findByPk(db.Scopus, newData.scopus_id, res, [db.Talent, db.Keyword])
      await db.Scopus.update({
        keyword: _.uniq([].concat(scopus.Keywords.map(ele => ele.keyword))).join('; ')
      },
      {
        where: {
          id: scopus.id
        }
      }
      )

      for (const keyword of data.keyword.split(';').map(ele => ele.trim())) {
        await keywordWeight.addKeyword(scopus.Talent.talent_group, scopus.domain_industry, keyword)
      }
      return res.status(201).json(newData)
    } catch (e) {
      e.message = 'Cannot store data from database.' + e
      next(e)
    }
  },
  storeList: async (req, res, next) => {
    const data = req.body
    try {
      await db.sequelize.transaction((t) => {
        return Keyword.bulkCreate(data.lists, {
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
      const data = await model.findByPk(Keyword, id, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Keyword, id, res, [
      {
        model: db.Scopus,
        include: [db.Talent]
      }
    ])
    for (const keyword of oldData.keyword.split(';').map(ele => ele.trim())) {
      await keywordWeight.removeKeyword(oldData.Scopu.Talent.talent_group, oldData.Scopu.domain_industry, keyword)
    }
    try {
      await db.sequelize.transaction((t) => {
        return Keyword.update(
          data, {
            where: {
              id
            }
          }, {
            transaction: t
          }
        )
      })

      const scopus = await model.findByPk(db.Scopus, oldData.scopus_id, res, [db.Keyword])
      await db.Scopus.update({
        keyword: _.uniq([].concat(scopus.Keywords.map(ele => ele.keyword))).join('; ')
      },
      {
        where: {
          id: scopus.id
        }
      }
      )

      for (const keyword of data.keyword.split(';').map(ele => ele.trim())) {
        await keywordWeight.addKeyword(oldData.Scopu.Talent.talent_group, oldData.Scopu.domain_industry, keyword)
      }
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot update data from database.'
      next(e)
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(Keyword, id, res, [
      {
        model: db.Scopus,
        include: [db.Talent]
      }
    ])
    const scopusId = oldData.scopus_id
    for (const keyword of oldData.keyword.split(';').map(ele => ele.trim())) {
      await keywordWeight.removeKeyword(oldData.Scopu.Talent.talent_group, oldData.Scopu.domain_industry, keyword)
    }
    try {
      await oldData.destroy()

      const scopus = await model.findByPk(db.Scopus, scopusId, res, [db.Keyword])
      await db.Scopus.update({
        keyword: _.uniq([].concat(scopus.Keywords.map(ele => ele.keyword))).join('; ')
      },
      {
        where: {
          id: scopus.id
        }
      }
      )

      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
