const { Validator } = require('node-input-validator')
const slugify = require('slugify')
const randomstring = require('randomstring')
const db = require('../models')
const { file, model } = require('../helpers')
const Op = db.Sequelize.Op
const Blog = db.Blog
const Img = db.Img
const BlogCategory = db.BlogCategory

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Blog.inputSchema)
    const matched = await v.check()
    if (matched) {
      next()
    } else {
      return res.status(400).json({
        message: 'Bad request.' + v.errors
      })
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

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [{
            title: {
              [Op.like]: `%${q}%`
            }
          },
          {
            content: {
              [Op.like]: `%${q}%`
            }
          },
          {
            tags: {
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
      const lists = await Blog.findAndCountAll({
        include: [Img, BlogCategory],
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

    data.slug = slugify(data.title)
    if (data.slug.replaceAll(/[^a-zA-Z0-9 ]/g, '').length < 2) {
      data.slug = randomstring.generate(16)
    }

    const checkData = await Blog.findOne({ where: { slug: data.slug } })
    if (checkData) {
      data.slug = `${randomstring.generate(8)}-${data.slug}`
    }

    try {
      const newData = await db.sequelize.transaction(async (t) => {
        if (req.file) {
          const newPath = await file.changeToWebp(req)
          data.Img = {
            url: newPath.replace('static', ''),
            path: newPath
          }
        }
        return Blog.create(data, {
          include: [Img],
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      file.removeTmpFile(req)
      e.message = 'Cannot store data from database.' + e
      next(e)
    }
  },
  show: async (req, res, next) => {
    const slug = req.params.slug
    try {
      const data = await model.findBySlug(Blog, slug, res, [Img, BlogCategory], { active: true })
      await db.sequelize.transaction(async (t) => {
        return await Blog.update(
          {
            hit: ++data.hit
          },
          {
            where: {
              id: data.id
            }
          }, {
            transaction: t
          }
        )
      })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Blog, id, res)
    try {
      let oldImg
      await db.sequelize.transaction(async (t) => {
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
        return Blog.update(
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
    const oldData = await model.findByPk(Blog, id, res)
    try {
      const oldImg = await oldData.getImg()
      oldImg.destroy()
      await db.sequelize.transaction(async (t) => {
        return await Blog.update(
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
    const oldData = await model.findByPk(Blog, id, res)
    try {
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
