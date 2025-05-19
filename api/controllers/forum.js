const randomstring = require('randomstring')
const { Validator } = require('node-input-validator')
const dayjs = require('dayjs')
const slugify = require('slugify')
const db = require('../models')
const { file, model } = require('../helpers')
const Sequelize = db.Sequelize
const Op = Sequelize.Op
const Forum = db.Forum
const Img = db.Img
const Member = db.Member
const Organization = db.Organization
const Researcher = db.Researcher

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Forum.inputSchema)
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
      q
    } = req.query

    let where = { deleted: false }

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
      const lists = await Forum.findAndCountAll({
        include: [
          // {
          //   model: Img,
          //   attributes: ['url']
          // },
          {
            model: Member,
            attributes: ['email', 'member_type'],
            include: [
              {
                model: Organization,
                attributes: ['name']
              },
              {
                model: Researcher,
                attributes: ['firstname', 'lastname']

              }
            ]
          }
        ],
        where,
        attributes: [
          'title', 'slug', 'tags', 'hit', 'createdAt', 'edited',
          [Sequelize.literal('(SELECT count(id) FROM comments WHERE deleted=0 and forum_id=Forum.id)'), 'count_comments']
        ],
        limit,
        offset,
        distinct: true,
        order: [
          ['id', 'desc']
        ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexAdmin: async (req, res, next) => {
    const {
      page,
      size,
      q
    } = req.query

    let where = { deleted: false }

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
      const lists = await Forum.findAndCountAll({
        include: [
          // {
          //   model: Img,
          //   attributes: ['url']
          // },
          {
            model: Member,
            attributes: ['email', 'member_type'],
            include: [
              {
                model: Organization,
                attributes: ['name']
              },
              {
                model: Researcher,
                attributes: ['firstname', 'lastname']

              }
            ]
          }
        ],
        where,
        attributes: [
          'title', 'slug', 'tags', 'hit', 'createdAt', 'edited', 'id',
          [Sequelize.literal('(SELECT count(id) FROM comments WHERE deleted=0 and forum_id=Forum.id)'), 'count_comments']
        ],
        limit,
        offset,
        distinct: true,
        order: [
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

    const checkData = await Forum.findOne({ where: { slug: data.slug } })
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
        return Forum.create(data, {
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
      const data = await model.findBySlug(Forum, slug, res, [
        // {
        //   model: Img,
        //   attributes: ['url']
        // },
        {
          model: Member,
          attributes: ['email', 'member_type'],
          include: [
            {
              model: Organization,
              attributes: ['name']
            },
            {
              model: Researcher,
              attributes: ['firstname', 'lastname']

            }
          ]
        }
      ], { deleted: false })
      await db.sequelize.transaction(async (t) => {
        return await Forum.update(
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
  showAdmin: async (req, res, next) => {
    const slug = req.params.slug
    try {
      const data = await model.findBySlug(Forum, slug, res, [
        // {
        //   model: Img,
        //   attributes: ['url']
        // },
        {
          model: Member,
          attributes: ['email', 'member_type'],
          include: [
            {
              model: Organization,
              attributes: ['name']
            },
            {
              model: Researcher,
              attributes: ['firstname', 'lastname']

            }
          ]
        }
      ], { deleted: false })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Forum, id, res)
    if (oldData.member_id === req.user.id) {
      if (dayjs() > dayjs(oldData.createdAt).add(1, 'hour')) {
        data.edited = true
      }
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
          return Forum.update(
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
    } else {
      return res.status(403).json({
        message: 'Access denied'
      })
    }
  },
  removeImage: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    data.img_id = null
    const oldData = await model.findByPk(Forum, id, res)
    if (oldData.member_id === req.user.id) {
      try {
        const oldImg = await oldData.getImg()
        oldImg.destroy()
        await db.sequelize.transaction(async (t) => {
          return await Forum.update(
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
    } else {
      return res.status(403).json({
        message: 'Access denied'
      })
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(Forum, id, res)
    if (oldData.member_id === req.user.id || (req.user.role && ['admin'].includes(req.user.role))) {
      try {
        await db.sequelize.transaction((t) => {
          return Forum.update(
            {
              deleted: true
            }, {
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
    } else {
      return res.status(403).json({
        message: 'Access denied'
      })
    }
  }
}
