const { Validator } = require('node-input-validator')
const dayjs = require('dayjs')
const db = require('../models')
const { model } = require('../helpers')
const Op = db.Sequelize.Op
const Forum = db.Forum
const Comment = db.Comment
const CommentLog = db.CommentLog
const Member = db.Member
const Organization = db.Organization
const Researcher = db.Researcher

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Comment.inputSchema)
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
    const id = req.params.id
    const {
      page,
      size,
      q
    } = req.query

    let where = {
      forum_id: id,
      reply_id: {
        [Op.eq]: null
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [{
            comment: {
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
      const lists = await Comment.findAndCountAll({
        include: [
          {
            model: Comment,
            attributes: ['comment', 'id', 'createdAt', 'reply_id', 'edited', 'deleted', 'member_id'],
            include: [
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
            ]
          },
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
        attributes: ['comment', 'id', 'createdAt', 'edited', 'deleted', 'member_id'],
        limit,
        offset,
        distinct: true,
        order: [
          // ['id', 'desc']
        ]
      })
      for (const item of lists.rows) {
        if (item.deleted) {
          item.comment = ''
          item.member_id = null
          item.Member.email = ''
          if (item.Member.Researcher) {
            item.Member.Researcher.firstname = ''
            item.Member.Researcher.lastname = ''
          } else if (item.Member.Organization) {
            item.Member.Organization.name = ''
          }
        }
        for (const itemReply of item.Comments) {
          if (item.deleted || itemReply.deleted) {
            itemReply.comment = ''
            itemReply.member_id = null
            itemReply.Member.email = ''
            if (itemReply.Member.Researcher) {
              itemReply.Member.Researcher.firstname = ''
              itemReply.Member.Researcher.lastname = ''
            } else if (itemReply.Member.Organization) {
              itemReply.Member.Organization.name = ''
            }
          }
        }
      }
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  indexAdmin: async (req, res, next) => {
    const id = req.params.id
    const {
      page,
      size,
      q
    } = req.query

    let where = {
      forum_id: id,
      reply_id: {
        [Op.eq]: null
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [{
            comment: {
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
      const lists = await Comment.findAndCountAll({
        include: [
          {
            model: Comment,
            attributes: ['comment', 'id', 'createdAt', 'updatedAt', 'reply_id', 'edited', 'deleted', 'member_id'],
            include: [
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
              },
              CommentLog
            ]
          },
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
          },
          CommentLog
        ],
        where,
        attributes: ['comment', 'id', 'createdAt', 'updatedAt', 'edited', 'deleted', 'member_id'],
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
    data.member_id = req.user.id
    try {
      const newData = await db.sequelize.transaction((t) => {
        return Comment.create(data, {
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      e.message = 'Cannot store data from database.' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await model.findByPk(Comment, id, res)
    if (oldData.member_id === req.user.id) {
      if (dayjs() > dayjs(oldData.createdAt).add(5, 'minute')) {
        await CommentLog.create({
          comment_id: oldData.id,
          comment: oldData.comment
        })
        data.edited = true
      }
      try {
        await db.sequelize.transaction((t) => {
          return Comment.update(
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
    } else {
      return res.status(403).json({
        message: 'Access denied'
      })
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(Comment, id, res)
    const dataForum = await model.findByPk(Forum, oldData.forum_id, res)
    const permissionIds = [oldData.member_id, dataForum.member_id]
    if (oldData.reply_id) {
      const oldParentData = await model.findByPk(Comment, oldData.reply_id, res)
      permissionIds.push(oldParentData.member_id)
    }
    if (permissionIds.includes(req.user.id) || (req.user.role && ['admin'].includes(req.user.role))) {
      try {
        await db.sequelize.transaction((t) => {
          return Comment.update(
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
