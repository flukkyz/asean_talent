const bcryptjs = require('bcryptjs')
const dayjs = require('dayjs')
const db = require('../models')
const Member = db.Member
const Organization = db.Organization
const Researcher = db.Researcher
const DataPrivacy = db.DataPrivacy
const OrganizationType = db.OrganizationType
const Country = db.Country
const MemberAccessToken = db.MemberAccessToken
const Op = db.Sequelize.Op

const findByPK = async (id, res, include = []) => {
  const data = await Member.findByPk(id, { include })
  if (data) {
    return data
  }
  return res.status(404).json({
    message: 'Not Found'
  })
}
const findByEmail = async (email, res, include = []) => {
  const where = {
    email
  }
  const data = await Member.findOne({
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
const updateMember = async (id, data, res) => {
  try {
    return await db.sequelize.transaction((t) => {
      return Member.update(
        data, {
          where: {
            id
          }
        }, {
          transaction: t
        }
      )
    })
  } catch (e) {
    return res.status(500).json({
      message: 'Cannot store data to database.' + e
    })
  }
}

module.exports = {
  index: async (req, res, next) => {
    const { page, size, q, country, memberType } = req.query

    let andWhere = []
    if (req.user.role === 'country_admin') {
      andWhere = [
        ...andWhere,
        {
          [Op.or]: [
            { '$Researcher.country_id$': req.user.country_id },
            { '$Organization.country_id$': req.user.country_id }
          ]
        }
      ]
    }
    if (memberType) {
      andWhere = [
        ...andWhere,
        { member_type: memberType }
      ]
    }
    if (q) {
      andWhere = [
        ...andWhere,
        {
          [Op.or]: [
            { email: { [Op.like]: `%${q}%` } },
            { '$Researcher.firstname$': { [Op.like]: `%${q}%` } },
            { '$Researcher.middlename$': { [Op.like]: `%${q}%` } },
            { '$Researcher.lastname$': { [Op.like]: `%${q}%` } },
            { '$Organization.name$': { [Op.like]: `%${q}%` } }
          ]
        }
      ]
    }
    if (country) {
      andWhere = [
        ...andWhere,
        {
          [Op.or]: [
            { '$Researcher.country_id$': country },
            { '$Organization.country_id$': country }
          ]
        }
      ]
    }

    const where = {
      [Op.and]: andWhere
    }

    const { limit, offset } = db.getPagination(page, size)
    try {
      const lists = await Member.findAndCountAll({
        distinct: true,
        include: [
          {
            model: Organization,
            include: [
              Country,
              OrganizationType
            ]
          },
          DataPrivacy,
          {
            model: Researcher,
            include: [
              Country,
              {
                model: Country,
                as: 'GraduateCountry'
              }
            ]
          },
          {
            model: MemberAccessToken,
            limit: 1,
            order: [
              ['createdAt', 'desc']
            ],
            attributes: ['ip', 'createdAt']
          }
        ],
        where,
        limit,
        offset
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
        return Member.create(data, {
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
    const id = req.params.id
    try {
      const data = await findByPK(id, res, [Organization, Researcher])
      const countryId = data.member_type === 'researcher' ? data.Researcher.country_id : data.Organization.country_id
      if (req.user.role === 'country_admin' && req.user.country_id !== countryId) {
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
  verify: async (req, res, next) => {
    const body = req.body
    try {
      const data = await findByPK(body.id, res)
      const updateData = {
        verify_at: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      await updateMember(data.id, updateData, res)
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await findByPK(id, res, [Organization, Researcher])
    const countryId = oldData.member_type === 'researcher' ? oldData.Researcher.country_id : oldData.Organization.country_id
    if (req.user.role === 'country_admin' && req.user.country_id !== countryId) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    if (data.password) {
      const salt = bcryptjs.genSaltSync(10)
      data.salt = salt
      data.password = bcryptjs.hashSync(data.password, salt)
    }
    try {
      await updateMember(id, data, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await findByPK(id, res, [Organization, Researcher])
    const countryId = oldData.member_type === 'researcher' ? oldData.Researcher.country_id : oldData.Organization.country_id
    if (req.user.role === 'country_admin' && req.user.country_id !== countryId) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      await Member.destroy({
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
