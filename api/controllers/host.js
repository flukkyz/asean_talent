const { Validator } = require('node-input-validator')
const db = require('../models')
const { file, model } = require('../helpers')
const Op = db.Sequelize.Op
const Host = db.Host
const OrganizationType = db.OrganizationType
const City = db.City
const Country = db.Country
const Img = db.Img

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Host.inputSchema)
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
      const data = await Host.count()
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
              website: {
                [Op.like]: `%${q}%`
              }
            },
            {
              email: {
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
      const lists = await Host.findAndCountAll({
        include: [
          City,
          Country,
          OrganizationType,
          Img
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
        if (data.organizationType) {
          data.OrganizationType = {
            name: data.organizationType
          }
        }
        if (data.city) {
          data.City = {
            name: data.city
          }
        }
        if (data.country) {
          data.Country = {
            name: data.country
          }
        }
        if (req.file) {
          const newPath = await file.changeToWebp(req)
          data.Img = {
            url: newPath.replace('static', ''),
            path: newPath
          }
        }
        return Host.create(data, {
          include: [
            City,
            Country,
            OrganizationType,
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
        return Host.bulkCreate(data.lists, {
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
      const data = await model.findByPk(Host, id, res, [City, Country, OrganizationType, Img], null, { active: true })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Host, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      let oldImg
      await db.sequelize.transaction(async (t) => {
        if (data.organizationType) {
          const newData = await OrganizationType.create({
            name: data.organizationType
          })
          data.organization_type_id = newData.id
        }
        if (data.city) {
          const newData = await City.create({
            name: data.city
          })
          data.city_id = newData.id
        } else if (!data.city_id) {
          data.city_id = null
        }
        if (data.country) {
          const newData = await Country.create({
            name: data.country
          })
          data.country_id = newData.id
        }
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
        return Host.update(
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
    const oldData = await model.findByPk(Host, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      const oldImg = await oldData.getImg()
      oldImg.destroy()
      await db.sequelize.transaction(async (t) => {
        return await Host.update(
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
    const oldData = await model.findByPk(Host, id, res)
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
