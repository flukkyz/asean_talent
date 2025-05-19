const bcryptjs = require('bcryptjs')
const db = require('../models')
const User = db.User
const AccessToken = db.AccessToken
const Country = db.Country
const Op = db.Sequelize.Op

const findByEmail = async (email, res, include = []) => {
  const where = {
    email
  }
  const data = await User.findOne({
    where,
    include
  })
  if (data) {
    return data
  }
  return res.status(404).json({
    message: 'Not Found'
  })
}

module.exports = {
  index: async (req, res, next) => {
    const { page, size, q } = req.query

    let where = []

    if (req.user.role === 'admin') {
      where = [

        ...where,
        {
          role: {
            [Op.not]: 'secret'
          }
        }
      ]
    }
    if (q) {
      where = [
        ...where,
        { [Op.or]: [{ email: { [Op.like]: `%${q}%` } }, { role: { [Op.like]: `%${q}%` } }] }
      ]
    }

    const { limit, offset } = db.getPagination(page, size)
    try {
      const lists = await User.findAndCountAll({
        include: [
          {
            model: AccessToken,
            limit: 1,
            order: [
              ['createdAt', 'desc']
            ],
            attributes: ['ip', 'createdAt']
          },
          Country
        ],
        where,
        limit,
        offset,
        attributes: ['id', 'name', 'email', 'role', 'country_id']
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
        return User.create(data, {
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  show: async (req, res, next) => {
    const email = req.params.username
    try {
      const data = await findByEmail(email, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  check: async (req, res, next) => {
    const data = req.body
    try {
      const result = await findByEmail(data.email, res)
      return res.json({ email: !!result })
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    if (data.password) {
      const salt = bcryptjs.genSaltSync(10)
      data.salt = salt
      data.password = bcryptjs.hashSync(data.password, salt)
    }
    try {
      await db.sequelize.transaction((t) => {
        return User.update(
          data,
          {
            where: {
              id
            }
          },
          {
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
  destroy: async (req, res, next) => {
    const id = req.params.id
    try {
      await User.destroy({
        where: {
          id
        }
      })
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
