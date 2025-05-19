const { Validator } = require('node-input-validator')
const db = require('../models')
const { file, model } = require('../helpers')
const Op = db.Sequelize.Op
const Publisher = db.Publisher
const Journal = db.Journal
const Publication = db.Publication
const Currency = db.Currency
const IndexStandard = db.IndexStandard
const Country = db.Country
const Img = db.Img

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Publication.inputSchema)
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
      const data = await Publication.count()
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
      show
    } = req.query

    let where = {}
    if (!show || show !== 'all') {
      where.active = true
    }

    if (req.user.role === 'country_admin') {
      where = {
        ...where,
        ...{ country_id: req.user.country_id }
      }
    }
    if (req.user.role === 'country_admin') {
      const publishers = await Publisher.findAll({
        where: {
          country_id: req.user.country_id
        },
        include: [Journal]
      })
      const journals = await Journal.findAll({
        where: {
          publisher_id: {
            [Op.in]: publishers.map(ele => ele.id)
          }
        }
      })
      where = {
        ...where,
        journal_id: {
          [Op.in]: journals.map(ele => ele.id)
        }
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
              important: {
                [Op.like]: `%${q}%`
              }
            },
            {
              description: {
                [Op.like]: `%${q}%`
              }
            },
            {
              contact_person: {
                [Op.like]: `%${q}%`
              }
            },
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
      const lists = await Publication.findAndCountAll({
        include: [
          Currency,
          Img,
          {
            model: Journal,
            include: [
              {
                model: Publisher,
                include: [Country]
              }, IndexStandard]
          }
        ],
        where,
        limit,
        offset,
        distinct: true,
        order: [
          // ['active', 'desc'],
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
      const newData = await db.sequelize.transaction(async (t) => {
        if (req.file) {
          const newPath = await file.changeToWebp(req)
          data.Img = {
            url: newPath.replace('static', ''),
            path: newPath
          }
        }
        return Publication.create(data, {
          include: [
            Img
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
        return Publication.bulkCreate(data.lists, {
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
      const data = await model.findByPk(Publication, id, res, [
        Currency,
        Img,
        {
          model: Journal,
          include: [
            {
              model: Publisher,
              include: [Country]
            }, IndexStandard]
        }
      ], null, { active: true })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Publication, id, res)
    if (req.user.role === 'country_admin') {
      const publishers = await Publisher.findAll({
        where: {
          country_id: req.user.country_id
        },
        include: [Journal]
      })
      const journals = await Journal.findAll({
        where: {
          publisher_id: {
            [Op.in]: publishers.map(ele => ele.id)
          }
        }
      })
      if (!journals.map(ele => ele.id).includes(oldData.journal_id)) {
        return res.status(403).json({
          message: 'Forbidden'
        })
      }
    }
    try {
      let oldImg
      await db.sequelize.transaction(async (t) => {
        data.currency_id = data.currency_id ?? null
        if (req.file) {
          oldImg = await oldData.getImg()
          const newPath = await file.changeToWebp(req)
          const newImg = await Img.create({
            url: newPath.replace('static', ''),
            path: newPath
          }, {
            transaction: t
          })
          data.img_id = newImg.id
        }
        return Publication.update(
          data, {
            where: {
              id
            }
          }, {
            transaction: t
          }
        )
      })
      if (oldImg) {
        oldImg.destroy()
      }
      return res.json(data)
    } catch (e) {
      file.removeTmpFile(req)
      e.message = 'Cannot update data from database.'
      next(e)
    }
  },
  removeImage: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    data.img_id = null
    const oldData = await model.findByPk(Publication, id, res)
    if (req.user.role === 'country_admin') {
      const publishers = await Publisher.findAll({
        where: {
          country_id: req.user.country_id
        },
        include: [Journal]
      })
      const journals = await Journal.findAll({
        where: {
          publisher_id: {
            [Op.in]: publishers.map(ele => ele.id)
          }
        }
      })
      if (!journals.map(ele => ele.id).includes(oldData.journal_id)) {
        return res.status(403).json({
          message: 'Forbidden'
        })
      }
    }
    try {
      const oldImg = await oldData.getImg()
      oldImg.destroy()
      await db.sequelize.transaction(async (t) => {
        return await Publication.update(
          { img_id: null }, {
            where: {
              id
            }
          }, {
            transaction: t
          }
        )
      })
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot update data from database.'
      next(e)
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(Publication, id, res)
    if (req.user.role === 'country_admin') {
      const publishers = await Publisher.findAll({
        where: {
          country_id: req.user.country_id
        },
        include: [Journal]
      })
      const journals = await Journal.findAll({
        where: {
          publisher_id: {
            [Op.in]: publishers.map(ele => ele.id)
          }
        }
      })
      if (!journals.map(ele => ele.id).includes(oldData.journal_id)) {
        return res.status(403).json({
          message: 'Forbidden'
        })
      }
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
