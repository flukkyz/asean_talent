const { Validator } = require('node-input-validator')
const db = require('../models')
const { model, keywordWeight } = require('../helpers')
const Op = db.Sequelize.Op
const Scopus = db.Scopus
const Keyword = db.Keyword
const Talent = db.Talent
const University = db.University
const Religion = db.Religion
const City = db.City
const Country = db.Country

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Scopus.inputSchema)
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
      const data = await Scopus.count()
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
      industry,
      talent
    } = req.query

    let andWhere = []
    if (req.user.role === 'country_admin') {
      andWhere = [
        ...andWhere,
        {
          [Op.or]: [
            { '$Talent.country_id$': req.user.country_id }
          ]
        }
      ]
    }
    if (industry) {
      andWhere = [
        ...andWhere,
        {
          [Op.or]: [
            { domain_industry: { [Op.like]: `%; ${industry};%` } },
            { domain_industry: { [Op.like]: `%;${industry};%` } },
            { domain_industry: { [Op.like]: `%; ${industry}` } },
            { domain_industry: { [Op.like]: `%;${industry}` } },
            { domain_industry: { [Op.like]: `${industry};%` } },
            { domain_industry: industry }
          ]
        }
      ]
    }
    if (q) {
      andWhere = [
        ...andWhere,
        {
          [Op.or]: [
            { scopus_id: { [Op.like]: `%${q}%` } },
            { domain_industry: { [Op.like]: `%; ${q};%` } },
            { domain_industry: { [Op.like]: `%;${q};%` } },
            { domain_industry: { [Op.like]: `%; ${q}` } },
            { domain_industry: { [Op.like]: `%;${q}` } },
            { domain_industry: { [Op.like]: `${q};%` } },
            { domain_industry: q },
            { keyword: { [Op.like]: `%; ${q};%` } },
            { keyword: { [Op.like]: `%;${q};%` } },
            { keyword: { [Op.like]: `%; ${q}` } },
            { keyword: { [Op.like]: `%;${q}` } },
            { keyword: { [Op.like]: `${q};%` } },
            { keyword: q }
          ]
        }
      ]
    }

    const where = {
      [Op.and]: andWhere
    }

    const include = [Keyword]
    if (talent && talent === '1') {
      include.push({
        model: Talent,
        include: [
          City,
          Country,
          {
            model: Country,
            as: 'Domicile'
          },
          University,
          Religion
        ]
      })
    }
    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await Scopus.findAndCountAll({
        include,
        where,
        limit,
        offset,
        subQuery: false,
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
        return Scopus.create(data, {
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
        return Scopus.bulkCreate(data.lists, {
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
      const data = await model.findByPk(Scopus, id, res, [Keyword, Talent])
      if (req.user.role === 'country_admin' && req.user.country_id !== data.Talent.country_id) {
        return res.status(403).json({
          message: 'Forbidden'
        })
      }
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
      const oldData = await model.findByPk(Scopus, id, res, [Keyword, Talent])
      if (req.user.role === 'country_admin' && req.user.country_id !== oldData.Talent.country_id) {
        return res.status(403).json({
          message: 'Forbidden'
        })
      }
      for (const keywordItem of oldData.Keywords) {
        for (const keyword of keywordItem.keyword.split(';').map(ele => ele.trim())) {
          await keywordWeight.removeKeyword(oldData.Talent.talent_group, oldData.domain_industry, keyword)
        }
      }
      await db.sequelize.transaction((t) => {
        return Scopus.update(
          data, {
            where: {
              id
            }
          }, {
            transaction: t
          }
        )
      })
      const newData = await model.findByPk(Scopus, id, res, [Keyword, Talent])
      for (const keywordItem of oldData.Keywords) {
        for (const keyword of keywordItem.keyword.split(';').map(ele => ele.trim())) {
          await keywordWeight.addKeyword(newData.Talent.talent_group, newData.domain_industry, keyword)
        }
      }
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot update data from database.' + e
      next(e)
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(Scopus, id, res, [Keyword, Talent])
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.Talent.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      for (const keywordItem of oldData.Keywords) {
        for (const keyword of keywordItem.keyword.split(';').map(ele => ele.trim())) {
          await keywordWeight.removeKeyword(oldData.Talent.talent_group, oldData.domain_industry, keyword)
        }
      }
      await Keyword.destroy({
        where: {
          scopus_id: id
        }
      })

      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.' + e
      next(e)
    }
  }
}
