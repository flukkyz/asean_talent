const { Validator } = require('node-input-validator')
const db = require('../models')
const { file, model } = require('../helpers')
const sequelize = db.Sequelize
const Op = db.Sequelize.Op
const QueryTypes = db.Sequelize.QueryTypes
const Talent = db.Talent
const University = db.University
const Religion = db.Religion
const City = db.City
const Country = db.Country
const Collaboration = db.Collaboration
const CoAuthor = db.CoAuthor
const Scopus = db.Scopus
const Keyword = db.Keyword
const DomainIndustry = db.DomainIndustry
const Img = db.Img

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, Talent.inputSchema)
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
      const data = await Talent.count({ where: { talent_group: 'talent' } })
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  countByIndustry: async (req, res, next) => {
    const sql = `select 
                  domain_industries.*,
                  count(talent_id)as count_talent
                  from scopuses
                  INNER join domain_industries
                  on scopuses.domain_industry like concat('%',domain_industries.name,'%')
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  where talent_group = 'talent'
                  group by domain_industries.name`
    try {
      const query = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT
      })
      return res.json(query)
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
      country,
      city,
      university
    } = req.query

    let where = { talent_group: 'talent' }
    if (req.user.role === 'country_admin') {
      where = {
        ...where,
        ...{ country_id: req.user.country_id }
      }
    } else if (country) {
      where = {
        ...where,
        ...{ country_id: country }
      }
    }
    if (city) {
      where = {
        ...where,
        ...{ city_id: city }
      }
    }
    if (university) {
      where = {
        ...where,
        ...{ university_id: university }
      }
    }

    if (q) {
      where = {
        ...where,
        ...{
          [Op.or]: [
            {
              firstname: {
                [Op.like]: `%${q}%`
              }
            },
            {
              lastname: {
                [Op.like]: `%${q}%`
              }
            },
            {
              email: {
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
      const countries = await Country.findAll({
        attributes: ['id'],
        order: [
          ['name', 'asc']
        ]
      })
      const cities = await City.findAll({
        attributes: ['id'],
        order: [
          ['name', 'asc']
        ]
      })
      const lists = await Talent.findAndCountAll({
        include: [
          City,
          Country,
          {
            model: Country,
            as: 'Domicile'
          },
          University,
          Religion,
          {
            model: Scopus,
            include: [Keyword, DomainIndustry]
          },
          {
            model: Collaboration,
            include: [CoAuthor]
          },
          Img
        ],
        where,
        limit,
        offset,
        distinct: true,
        order: [
          sequelize.literal(`FIELD(country_id,${countries.map(ele => ele.id).join(',')})`),
          sequelize.literal(`FIELD(city_id,${cities.map(ele => ele.id).join(',')})`),
          ['firstname', 'asc'],
          ['lastname', 'asc']
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
        if (data.university) {
          data.University = {
            name: data.university
          }
        }
        if (data.religion) {
          data.Religion = {
            name: data.religion
          }
        }
        if (data.city) {
          data.City = {
            name: data.city
          }
        }
        let newDataCountry
        if (data.country) {
          newDataCountry = await Country.create({
            name: data.country
          })
          data.country_id = newDataCountry.id
        }
        if (data.domicile) {
          if (data.country && data.domicile === data.country) {
            data.domicile_id = newDataCountry.id
          } else {
            const newData = await Country.create({
              name: data.domicile
            })
            data.domicile_id = newData.id
          }
        }
        data.CoAuthors = [
          {
            firstname: data.firstname,
            lastname: data.lastname
          }
        ]
        if (req.file) {
          const newPath = await file.changeToWebp(req)
          data.Img = {
            url: newPath.replace('static', ''),
            path: newPath
          }
        }
        data.talent_group = 'talent'
        return Talent.create(data, {
          include: [
            City,
            Country,
            {
              model: Country,
              as: 'Domicile'
            },
            University,
            Religion,
            CoAuthor,
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
      data.lists = data.lists.map((ele) => {
        return {
          ...ele,
          talent_group: 'talent'
        }
      })
      await db.sequelize.transaction((t) => {
        return Talent.bulkCreate(data.lists, {
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
      const data = await model.findByPk(Talent, id, res, [
        City,
        Country,
        {
          model: Country,
          as: 'Domicile'
        },
        University,
        Religion,
        {
          model: Scopus,
          include: [Keyword, DomainIndustry]
        },
        {
          model: Collaboration,
          include: [CoAuthor]
        },
        Img
      ])
      if (req.user.role === 'country_admin' && req.user.country_id !== data.country_id) {
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
    const oldData = await model.findByPk(Talent, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      let oldImg
      await db.sequelize.transaction(async (t) => {
        if (data.university) {
          const newData = await University.create({
            name: data.university
          })
          data.organization_type_id = newData.id
        }
        if (data.religion) {
          const newData = await Religion.create({
            name: data.religion
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
        let newDataCountry
        if (data.country) {
          newDataCountry = await Country.create({
            name: data.country
          })
          data.country_id = newDataCountry.id
        }
        if (data.domicile) {
          if (data.country && data.domicile === data.country) {
            data.domicile_id = newDataCountry.id
          } else {
            const newData = await Country.create({
              name: data.domicile
            })
            data.domicile_id = newData.id
          }
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
        return Talent.update(
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
    const oldData = await model.findByPk(Talent, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      const oldImg = await oldData.getImg()
      oldImg.destroy()
      await db.sequelize.transaction(async (t) => {
        return await Talent.update(
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
    const oldData = await model.findByPk(Talent, id, res)
    if (req.user.role === 'country_admin' && req.user.country_id !== oldData.country_id) {
      return res.status(403).json({
        message: 'Forbidden'
      })
    }
    try {
      await Scopus.destroy({
        where: {
          talent_id: id
        }
      })
      await Collaboration.destroy({
        where: {
          talent_id: id
        }
      })
      await CoAuthor.destroy({
        where: {
          talent_id: id
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
