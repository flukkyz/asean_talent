const _ = require('lodash')
const emailValidator = require('email-validator')
const db = require('../models')
const { keywordWeight } = require('../helpers')

module.exports = {
  storeTalent: async (req, res, next) => {
    const body = req.body

    try {
      let talent = null
      let scopus = null
      if (!body.name || body.name.trim().length === 0) {
        return res.status(404).json({
          message: 'Not Found Name'
        })
      }

      if (body.scopus_id) {
        scopus = await db.Scopus.findOne({
          where: {
            scopus_id: body.scopus_id.trim()
          },
          include: [
            {
              model: db.Talent,
              include: [db.Img]
            },
            db.Keyword
          ]
        })
        if (scopus) {
          talent = scopus.Talent
        }
      }
      if (!talent) {
        const splitName = body.name.split(',')
        const where = {}
        if (splitName.length === 2) {
          where.firstname = splitName[1].toUpperCase().trim()
        }
        where.lastname = splitName[0].toUpperCase().trim()
        const findTalent = await db.Talent.findOne({ where, include: [db.Img] })
        if (findTalent) {
          talent = findTalent
        }
      }
      const domainIndustries = await db.DomainIndustry.findAll()
      const domainIndustry = body.industry ? _.find(domainIndustries, { name: body.industry.trim() }) : null
      if (!domainIndustry) {
        return res.status(404).json({
          message: 'Not Found Industry'
        })
      }
      const keywords = []
      let keywordMerges = []
      for (let index = 1; index <= 5; index++) {
        if (body[`keyword${index}`]) {
          keywords.push({
            keyword: body[`keyword${index}`],
            domain_industry_id: domainIndustry.id
          })
          keywordMerges = [
            ...keywordMerges,
            ...body[`keyword${index}`].split(';').map(ele => ele.trim())
          ]
        }
      }

      if (talent && talent.id) {
        if (talent.talent_group === 'young_talent') {
          return res.status(400).json({
            message: 'This data is already in Young Talent'
          })
        }
        if (req.user.role === 'country_admin' && req.user.country_id !== talent.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.picture) {
          const oldImg = talent.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\talents\\${body.picture}`,
            path: `static\\uploads\\talents\\${body.picture}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.Talent.update(body, {
          where: {
            id: talent.id
          }
        })
        body.talent_id = talent.id
        body.domain_industry_id = domainIndustry.id
        if (scopus) {
          if (keywords.length > 0) {
            for await (const scopusKeyword of scopus.Keywords) {
              for await (const keyword of scopusKeyword.keyword.split(';').map(ele => ele.trim())) {
                await keywordWeight.removeKeyword(talent.talent_group, scopus.domain_industry, keyword)
              }
            }
            await db.Keyword.destroy({
              where: {
                scopus_id: scopus.id
              }
            })
          }
          let newDomainIndustry = scopus.domain_industry || ''
          if (!newDomainIndustry.includes(domainIndustry.name)) {
            newDomainIndustry += `${newDomainIndustry.trim().length > 0 ? '; ' : ''}${domainIndustry.name}`
          }

          await db.Scopus.update({
            ...body,
            domain_industry: newDomainIndustry,
            keyword: _.uniq([].concat(keywords.map(ele => ele.keyword))).join('; ')
          },
          {
            where: {
              id: scopus.id
            }
          })
          for await (const keyword of keywords) {
            await db.Keyword.create({
              ...keyword,
              scopus_id: scopus.id
            })
          }
          for await (const keyword of keywordMerges) {
            await keywordWeight.addKeyword(talent.talent_group, newDomainIndustry, keyword)
          }
        } else {
          const newScopus = {
            ...body,
            domain_industry: domainIndustry.name,
            keyword: _.uniq([].concat(keywords.map(ele => ele.keyword))).join('; '),
            Keywords: [...keywords]
          }
          await db.Scopus.create(newScopus, {
            include: [db.Keyword]
          })
          for await (const keyword of keywordMerges) {
            await keywordWeight.addKeyword(talent.talent_group, domainIndustry.name, keyword)
          }
        }
        return res.status(204).send()
      } else {
        const splitName = body.name.split(',')
        if (splitName.length === 2 && splitName[1] && splitName[1].trim().length > 0) {
          body.firstname = splitName[1].toUpperCase().trim()

          const universities = await db.University.findAll()
          const cities = await db.City.findAll()
          const countries = await db.Country.findAll()
          const religions = await db.Religion.findAll()

          body.lastname = splitName[0].toUpperCase().trim()
          if (body.picture) {
            body.Img = {
              url: `\\uploads\\talents\\${body.picture}`,
              path: `static\\uploads\\talents\\${body.picture}`
            }
          }

          body.university_id = body.university ? _.find(universities, { name: body.university.trim() }).id : null
          body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
          if (!body.country || body.country.trim().length === 0) {
            return res.status(404).json({
              message: 'Country is required'
            })
          }
          body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
          if (!body.country_id) {
            return res.status(404).json({
              message: `Not found country name "${body.country}"`
            })
          } else if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
            return res.status(403).json({
              message: 'Forbidden, cannot upload other country'
            })
          }
          body.domicile_id = body.domicile ? _.find(countries, { name: body.country.trim() }).id : null
          body.religion_id = body.religion ? _.find(religions, { name: body.religion.trim() }).id : null
          body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
          body.Scopus = [{
            ...body,
            domain_industry: domainIndustry.name,
            keyword: _.uniq([].concat(keywords.map(ele => ele.keyword))).join('; '),
            domain_industry_id: domainIndustry.id
          }]
          for await (const keyword of keywordMerges) {
            await keywordWeight.addKeyword('talent', domainIndustry.name, keyword)
          }
          body.Scopus[0].Keywords = [...keywords]
          const newTalent = await db.Talent.create(body, {
            include: [
              {
                model: db.Scopus,
                include: [db.Keyword]
              },
              db.Img
            ]
          })
          const findCoAuthor = await db.CoAuthor.findOne({
            where: {
              firstname: newTalent.firstname,
              lastname: newTalent.lastname
            }
          })
          if (findCoAuthor) {
            if (!findCoAuthor.talent_id) {
              await db.CoAuthor.update({
                talent_id: newTalent.id
              }, {
                where: {
                  id: findCoAuthor.id
                }
              })
            }
          } else {
            await db.CoAuthor.create({
              firstname: newTalent.firstname,
              lastname: newTalent.lastname,
              talent_id: newTalent.id
            })
          }
          return res.status(204).send()
        } else {
          return res.status(500).message(`Row: ${body.row} >> "${body.name}" is not found firstname`)
        }
      }
    } catch (e) {
      console.log(`Row: ${body.row}, ${body.name}`)
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeYoungTalent: async (req, res, next) => {
    const body = req.body

    try {
      let talent = null
      let scopus = null
      if (!body.name || body.name.trim().length === 0) {
        return res.status(404).json({
          message: 'Not Found Name'
        })
      }

      if (body.scopus_id) {
        scopus = await db.Scopus.findOne({
          where: {
            scopus_id: body.scopus_id.trim()
          },
          include: [
            {
              model: db.Talent,
              include: [db.Img]
            },
            db.Keyword
          ]
        })
        if (scopus) {
          talent = scopus.Talent
        }
      }
      if (!talent) {
        const splitName = body.name.split(',')
        const where = {}
        if (splitName.length === 2) {
          where.firstname = splitName[1].toUpperCase().trim()
        }
        where.lastname = splitName[0].toUpperCase().trim()
        const findTalent = await db.Talent.findOne({ where, include: [db.Img] })
        if (findTalent) {
          talent = findTalent
        }
      }

      // const domainIndustries = await db.DomainIndustry.findAll()
      // const domainIndustry = body.industry ? _.find(domainIndustries, { name: body.industry.trim() }) : null
      const domainIndustry = await db.DomainIndustry.findOne({ where: { name: 'Young Talent' } })
      if (!domainIndustry) {
        return res.status(404).json({
          message: 'Not Found Industry'
        })
      }
      const keywords = []
      let keywordMerges = []
      for (let index = 1; index <= 5; index++) {
        if (body[`keyword${index}`]) {
          keywords.push({
            keyword: body[`keyword${index}`],
            domain_industry_id: domainIndustry.id
          })
          keywordMerges = [
            ...keywordMerges,
            ...body[`keyword${index}`].split(';').map(ele => ele.trim())
          ]
        }
      }

      if (talent && talent.id) {
        if (talent.talent_group === 'talent') {
          return res.status(400).json({
            message: 'This data is already in Talent'
          })
        }
        if (req.user.role === 'country_admin' && req.user.country_id !== talent.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.picture) {
          const oldImg = talent.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\talents\\${body.picture}`,
            path: `static\\uploads\\talents\\${body.picture}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.Talent.update(body, {
          where: {
            id: talent.id
          }
        })
        body.talent_id = talent.id
        body.domain_industry_id = domainIndustry.id
        if (scopus) {
          if (keywords.length > 0) {
            for await (const scopusKeyword of scopus.Keywords) {
              for await (const keyword of scopusKeyword.keyword.split(';').map(ele => ele.trim())) {
                await keywordWeight.removeKeyword(talent.talent_group, scopus.domain_industry, keyword)
              }
            }
            await db.Keyword.destroy({
              where: {
                scopus_id: scopus.id
              }
            })
          }
          let newDomainIndustry = scopus.domain_industry || ''
          if (!newDomainIndustry.includes(domainIndustry.name)) {
            newDomainIndustry += `${newDomainIndustry.trim().length > 0 ? '; ' : ''}${domainIndustry.name}`
          }

          await db.Scopus.update({
            ...body,
            domain_industry: newDomainIndustry,
            keyword: _.uniq([].concat(keywords.map(ele => ele.keyword))).join('; ')
          },
          {
            where: {
              id: scopus.id
            }
          })
          for await (const keyword of keywords) {
            await db.Keyword.create({
              ...keyword,
              scopus_id: scopus.id
            })
          }
          for await (const keyword of keywordMerges) {
            await keywordWeight.addKeyword(talent.talent_group, newDomainIndustry, keyword)
          }
        } else {
          const newScopus = {
            ...body,
            domain_industry: domainIndustry.name,
            keyword: _.uniq([].concat(keywords.map(ele => ele.keyword))).join('; '),
            Keywords: [...keywords]
          }
          await db.Scopus.create(newScopus, {
            include: [db.Keyword]
          })
          for await (const keyword of keywordMerges) {
            await keywordWeight.addKeyword(talent.talent_group, domainIndustry.name, keyword)
          }
        }
        return res.status(204).send()
      } else {
        const splitName = body.name.split(',')
        if (splitName.length === 2 && splitName[1] && splitName[1].trim().length > 0) {
          body.firstname = splitName[1].toUpperCase().trim()

          const universities = await db.University.findAll()
          const cities = await db.City.findAll()
          const countries = await db.Country.findAll()
          const religions = await db.Religion.findAll()

          body.lastname = splitName[0].toUpperCase().trim()
          if (body.picture) {
            body.Img = {
              url: `\\uploads\\talents\\${body.picture}`,
              path: `static\\uploads\\talents\\${body.picture}`
            }
          }

          body.university_id = body.university ? _.find(universities, { name: body.university.trim() }).id : null
          body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
          if (!body.country || body.country.trim().length === 0) {
            return res.status(404).json({
              message: 'Country is required'
            })
          }
          body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
          if (!body.country_id) {
            return res.status(404).json({
              message: `Not found country name "${body.country}"`
            })
          } else if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
            return res.status(403).json({
              message: 'Forbidden, cannot upload other country'
            })
          }
          body.domicile_id = body.domicile ? _.find(countries, { name: body.country.trim() }).id : null
          body.religion_id = body.religion ? _.find(religions, { name: body.religion.trim() }).id : null
          body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
          body.Scopus = [{
            ...body,
            domain_industry: domainIndustry.name,
            keyword: _.uniq([].concat(keywords.map(ele => ele.keyword))).join('; '),
            domain_industry_id: domainIndustry.id
          }]
          for await (const keyword of keywordMerges) {
            await keywordWeight.addKeyword('young_talent', domainIndustry.name, keyword)
          }
          body.Scopus[0].Keywords = [...keywords]
          body.talent_group = 'young_talent'
          const newTalent = await db.Talent.create(body, {
            include: [
              {
                model: db.Scopus,
                include: [db.Keyword]
              },
              db.Img
            ]
          })
          const findCoAuthor = await db.CoAuthor.findOne({
            where: {
              firstname: newTalent.firstname,
              lastname: newTalent.lastname
            }
          })
          if (findCoAuthor) {
            if (!findCoAuthor.talent_id) {
              await db.CoAuthor.update({
                talent_id: newTalent.id
              }, {
                where: {
                  id: findCoAuthor.id
                }
              })
            }
          } else {
            await db.CoAuthor.create({
              firstname: newTalent.firstname,
              lastname: newTalent.lastname,
              talent_id: newTalent.id
            })
          }
          return res.status(204).send()
        } else {
          return res.status(500).message(`Row: ${body.row} >> "${body.name}" is not found firstname`)
        }
      }
    } catch (e) {
      console.log(`Row: ${body.row}, ${body.name}`)
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeImage: (req, res, next) => {
    return res.status(204).send()
  },
  storeCoAuthor: async (req, res, next) => {
    const body = req.body

    try {
      let talent = null

      if (body.scopus_id) {
        const scopus = await db.Scopus.findOne({
          where: {
            scopus_id: body.scopus_id.trim()
          },
          include: db.Talent
        })
        if (scopus) {
          talent = scopus.Talent
        }
      }
      if (!talent) {
        const splitName = body.name.split(',')
        const where = {}
        if (splitName.length === 2) {
          where.firstname = splitName[1].toUpperCase().trim()
        }
        where.lastname = splitName[0].toUpperCase().trim()
        talent = await db.Talent.findOne({ where })
      }
      if (talent) {
        if (req.user.role === 'country_admin' && req.user.country_id !== talent.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        for await (const i of _.range(5)) {
          if (body[`co_author${i + 1}`] && body[`co_author${i + 1}`].trim()) {
            const splitName = body[`co_author${i + 1}`].split(',')
            const coAuthorData = {}
            if (splitName.length === 2 && splitName[1] && splitName[1].trim().length > 0) {
              coAuthorData.firstname = splitName[1].toUpperCase().trim()
            }
            coAuthorData.lastname = splitName[0].toUpperCase().trim()

            let coAuthor = await db.CoAuthor.findOne({
              where: coAuthorData
            })
            if (!coAuthor) {
              coAuthor = await db.CoAuthor.create(coAuthorData)
              await db.Collaboration.create({
                co_author_id: coAuthor.id,
                talent_id: talent.id
              })
            } else {
              const findOldCollaboration = await db.Collaboration.findOne({
                co_author_id: coAuthor.id,
                talent_id: talent.id
              })
              if (findOldCollaboration) {
                await db.Collaboration.destroy({
                  where: {
                    co_author_id: coAuthor.id,
                    talent_id: talent.id
                  }
                })
              }
              await db.Collaboration.create({
                co_author_id: coAuthor.id,
                talent_id: talent.id
              })
            }
          }
        }
        return res.status(204).send()
      } else {
        return res.status(404).message('not Found Talent')
      }
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeMatchCompany: async (req, res, next) => {
    const body = req.body

    if (!body.country || body.country.trim().length === 0) {
      return res.status(404).json({
        message: 'Country is required'
      })
    }
    try {
      const organizationTypes = await db.OrganizationType.findAll()
      const cities = await db.City.findAll()
      const countries = await db.Country.findAll()

      body.organization_type_id = body.organization_type ? _.find(organizationTypes, { name: body.organization_type.trim() }).id : null
      body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
      body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
      if (!body.country_id) {
        return res.status(404).json({
          message: `Not found country name "${body.country}"`
        })
      }

      const findData = await db.MatchCompany.findOne({
        where: {
          name: body.name.trim(),
          country_id: body.country_id
        },
        include: [db.Img]
      })
      if (findData) {
        if (req.user.role === 'country_admin' && req.user.country_id !== findData.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          const oldImg = findData.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\companys\\${body.logo}`,
            path: `static\\uploads\\companys\\${body.logo}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.MatchCompany.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          body.Img = {
            url: `\\uploads\\companys\\${body.logo}`,
            path: `static\\uploads\\companys\\${body.logo}`
          }
        }
        body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
        await db.MatchCompany.create(body, {
          include: [
            db.Img
          ]
        })
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeFundingOrganization: async (req, res, next) => {
    const body = req.body

    if (!body.country || body.country.trim().length === 0) {
      return res.status(404).json({
        message: 'Country is required'
      })
    }
    try {
      const organizationTypes = await db.OrganizationType.findAll()
      const cities = await db.City.findAll()
      const countries = await db.Country.findAll()
      const currencies = await db.Currency.findAll()
      const departments = await db.Department.findAll()

      body.organization_type_id = body.organization_type ? _.find(organizationTypes, { name: body.organization_type.trim() }).id : null
      body.currency_id = body.currency ? _.find(currencies, { code: body.currency.trim() }).id : null
      body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
      body.department_id = body.department ? _.find(departments, { name: body.department.trim() }).id : null
      body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
      if (!body.country_id) {
        return res.status(404).json({
          message: `Not found country name "${body.country}"`
        })
      }

      const findData = await db.FundingOrganization.findOne({
        where: {
          name: body.name.trim(),
          country_id: body.country_id
        },
        include: [db.Img]
      })
      if (findData) {
        if (req.user.role === 'country_admin' && req.user.country_id !== findData.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          const oldImg = findData.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\fundings\\${body.logo}`,
            path: `static\\uploads\\fundings\\${body.logo}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.FundingOrganization.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          body.Img = {
            url: `\\uploads\\fundings\\${body.logo}`,
            path: `static\\uploads\\fundings\\${body.logo}`
          }
        }
        body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
        await db.FundingOrganization.create(body, {
          include: [
            db.Img
          ]
        })
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      console.log(e)

      next(e)
    }
  },
  storeLabLocation: async (req, res, next) => {
    const body = req.body

    if (!body.country || body.country.trim().length === 0) {
      return res.status(404).json({
        message: 'Country is required'
      })
    }
    try {
      const organizationTypes = await db.OrganizationType.findAll()
      const cities = await db.City.findAll()
      const countries = await db.Country.findAll()
      const universities = await db.University.findAll()
      const currencies = await db.Currency.findAll()

      body.organization_type_id = body.organization_type ? _.find(organizationTypes, { name: body.organization_type.trim() }).id : null
      body.currency_id = body.currency ? _.find(currencies, { code: body.currency.trim() }).id : null
      body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
      body.university_id = body.org_name ? _.find(universities, { name: body.org_name.trim() }).id : null
      body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
      if (!body.country_id) {
        return res.status(404).json({
          message: `Not found country name "${body.country}"`
        })
      }

      const machineBody = {
        name: body.machine_name.trim(),
        status: body.machine_status && body.machine_status.toLowerCase() === 'available' ? 'active' : 'inactive',
        price: body.machine_price,
        link: body.machine_link,
        service_condition: body.service_condition,
        currency_id: body.currency_id
      }

      const findData = await db.LabLocation.findOne({
        where: {
          name: body.name.trim(),
          country_id: body.country_id
        },
        include: [db.Img]
      })
      if (findData) {
        if (req.user.role === 'country_admin' && req.user.country_id !== findData.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          const oldImg = findData.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\labs\\${body.logo}`,
            path: `static\\uploads\\labs\\${body.logo}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.LabLocation.update(body, {
          where: {
            id: findData.id
          }
        })

        if (body.machine_name && body.machine_name.trim()) {
          const findMachineDetailData = await db.MachineDetail.findOne({
            where: {
              name: machineBody.name,
              lab_location_id: findData.id
            }
          })

          if (findMachineDetailData) {
            await db.MachineDetail.update(machineBody, {
              where: {
                id: findMachineDetailData.id
              }
            })
          } else {
            await db.MachineDetail.create({
              ...machineBody,
              lab_location_id: findData.id
            })
          }
        }
      } else {
        if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          body.Img = {
            url: `\\uploads\\labs\\${body.logo}`,
            path: `static\\uploads\\labs\\${body.logo}`
          }
        }
        body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
        body.MachineDetails = [{
          ...machineBody
        }]
        await db.LabLocation.create(body, {
          include: [
            db.MachineDetail,
            db.Img
          ]
        })
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeTrainingCourse: async (req, res, next) => {
    const body = req.body

    if (!body.country || body.country.trim().length === 0) {
      return res.status(404).json({
        message: 'Country is required'
      })
    }
    try {
      const universities = await db.University.findAll()
      const currencies = await db.Currency.findAll()
      const organizationTypes = await db.OrganizationType.findAll()
      const cities = await db.City.findAll()
      const countries = await db.Country.findAll()

      body.university_id = body.org_name ? _.find(universities, { name: body.org_name.trim() }).id : null
      body.currency_id = body.currency ? _.find(currencies, { code: body.currency.trim() }).id : null
      body.organization_type_id = body.organization_type ? _.find(organizationTypes, { name: body.organization_type.trim() }).id : null
      body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
      body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
      if (!body.country_id) {
        return res.status(404).json({
          message: `Not found country name "${body.country}"`
        })
      }

      const findData = await db.TrainingCourse.findOne({
        where: {
          name: body.name.trim(),
          country_id: body.country_id
        },
        include: [db.Img]
      })
      if (findData) {
        if (req.user.role === 'country_admin' && req.user.country_id !== findData.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          const oldImg = findData.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\trainings\\${body.logo}`,
            path: `static\\uploads\\trainings\\${body.logo}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.TrainingCourse.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          body.Img = {
            url: `\\uploads\\trainings\\${body.logo}`,
            path: `static\\uploads\\trainings\\${body.logo}`
          }
        }
        body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
        await db.TrainingCourse.create(body, {
          include: [
            db.Img
          ]
        })
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeHost: async (req, res, next) => {
    const body = req.body

    try {
      // const organizationTypes = await db.OrganizationType.findAll()
      // const cities = await db.City.findAll()
      if (!body.country || body.country.trim().length === 0) {
        return res.status(404).json({
          message: 'Country is required'
        })
      }
      const countries = await db.Country.findAll()

      // body.organization_type_id = body.organization_type ? _.find(organizationTypes, { name: body.organization_type.trim() }).id : null
      // body.city_id = body.city ? _.find(cities, { name: body.city.trim() }).id : null
      body.country_id = body.country ? _.find(countries, { name: body.country.trim() }).id : null
      if (!body.country_id) {
        return res.status(404).json({
          message: `Not found country name "${body.country}"`
        })
      }

      const findData = await db.Host.findOne({
        where: {
          name: body.name.trim(),
          country_id: body.country_id
        },
        include: [db.Img]
      })
      if (findData) {
        if (req.user.role === 'country_admin' && req.user.country_id !== findData.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          const oldImg = findData.Img
          const newImg = await db.Img.create({
            url: `\\uploads\\hosts\\${body.logo}`,
            path: `static\\uploads\\hosts\\${body.logo}`
          })
          body.img_id = newImg.id
          if (oldImg) {
            oldImg.destroy()
          }
        }
        await db.Host.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        if (req.user.role === 'country_admin' && req.user.country_id !== body.country_id) {
          return res.status(403).json({
            message: 'Forbidden, cannot upload other country'
          })
        }
        if (body.logo) {
          body.Img = {
            url: `\\uploads\\hosts\\${body.logo}`,
            path: `static\\uploads\\hosts\\${body.logo}`
          }
        }
        body.email = emailValidator.validate(body.email) ? body.email.toLowerCase() : ''
        await db.Host.create(body, {
          include: [
            db.Img
          ]
        })
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeCity: async (req, res, next) => {
    const body = req.body

    try {
      const findData = await db.City.findOne({
        where: {
          name: body.name.trim()
        }
      })
      if (findData) {
        await db.City.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        await db.City.create(body)
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeCountry: async (req, res, next) => {
    const body = req.body

    try {
      const findData = await db.Country.findOne({
        where: {
          name: body.name.trim()
        }
      })
      if (findData) {
        await db.Country.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        await db.Country.create(body)
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  storeUniversity: async (req, res, next) => {
    const body = req.body

    try {
      const findData = await db.University.findOne({
        where: {
          name: body.name.trim()
        }
      })
      if (findData) {
        await db.University.update(body, {
          where: {
            id: findData.id
          }
        })
      } else {
        await db.University.create(body)
      }
      return res.status(204).send()
    } catch (e) {
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  },
  updateScopus: async (req, res, next) => {
    const body = req.body

    try {
      let scopus = null

      if (body.scopus_id) {
        scopus = await db.Scopus.findOne({
          where: {
            scopus_id: body.scopus_id.trim()
          },
          include: [db.Talent]
        })
        if (scopus) {
          if (req.user.role === 'country_admin' && req.user.country_id !== scopus.Talent.country_id) {
            return res.status(403).json({
              message: 'Forbidden, cannot upload other country'
            })
          }
          await db.Scopus.update({
            ...body
          },
          {
            where: {
              id: scopus.id
            }
          })
          return res.status(204).send()
        } else {
          return res.status(404).json({
            message: 'Not Found Scopus'
          })
        }
      } else {
        return res.status(400).json({
          message: 'No Scopus ID in Body'
        })
      }
    } catch (e) {
      console.log(`Row: ${body.row}, ${body.name}`)
      e.message = 'Upload Fail: ' + e
      next(e)
    }
  }
}
