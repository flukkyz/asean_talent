const _ = require('lodash')
const cosine = require('cosine')
const db = require('../models')
const { model } = require('../helpers')
const QueryTypes = db.Sequelize.QueryTypes

module.exports = {
  searchMatching: async (req, res, next) => {
    const data = req.body

    try {
      if (data.search && data.search.trim().length > 0) {
        let where = 'where '
        const replacementVal = {
          search: `%${data.search.trim()}%`
        }
        if (data.searchType === 'all') {
          where += '(talents.firstname like :search or talents.lastname like :search or keywords.keyword like :search) '
        } else if (data.searchType === 'name') {
          where += '(talents.firstname like :search or talents.lastname like :search) '
        } else if (data.searchType === 'keyword') {
          where += 'keywords.keyword like :search '
        }

        if (data.filterGenders.length > 0) {
          where += 'and talents.gender in (:gender)'
          replacementVal.gender = data.filterGenders
        }
        if (data.filterCountries.length > 0) {
          where += 'and talents.country_id in (:country) '
          replacementVal.country = data.filterCountries
        }
        if (data.filterCities.length > 0) {
          where += 'and talents.city_id in (:city) '
          replacementVal.city = data.filterCities
        }
        if (data.filterUniversities.length > 0) {
          where += 'and talents.university_id in (:university) '
          replacementVal.university = data.filterUniversities
        }
        if (data.filterMinHIndex !== null) {
          where += 'and scopuses.h_index >= :minHIndex '
          replacementVal.minHIndex = data.filterMinHIndex
        }
        if (data.filterMaxHIndex !== null) {
          where += 'and scopuses.h_index <= :maxHIndex '
          replacementVal.maxHIndex = data.filterMaxHIndex
        }
        if (data.filterMinMostRecentPub !== null) {
          where += 'and scopuses.most_recent_pub >= :minMostRecentPub '
          replacementVal.minMostRecentPub = data.filterMinMostRecentPub
        }
        if (data.filterMaxMostRecentPub !== null) {
          where += 'and scopuses.most_recent_pub <= :maxMostRecentPub '
          replacementVal.maxMostRecentPub = data.filterMaxMostRecentPub
        }
        if (data.filterMinDocumentCount !== null) {
          where += 'and scopuses.document_count >= :minDocumentCount '
          replacementVal.minDocumentCount = data.filterMinDocumentCount
        }
        if (data.filterMaxDocumentCount !== null) {
          where += 'and scopuses.document_count <= :maxDocumentCount '
          replacementVal.maxDocumentCount = data.filterMaxDocumentCount
        }
        if (data.filterMinNoOfCoAuthor !== null) {
          where += 'and scopuses.no_of_coauthor >= :minNoOfCoAuthor '
          replacementVal.minNoOfCoAuthor = data.filterMinNoOfCoAuthor
        }
        if (data.filterMaxNoOfCoAuthor !== null) {
          where += 'and scopuses.no_of_coauthor <= :maxNoOfCoAuthor '
          replacementVal.maxNoOfCoAuthor = data.filterMaxNoOfCoAuthor
        }

        if (data.group) {
          where += 'and talents.talent_group = :group '
          replacementVal.group = data.group
        }

        const sql = `SELECT 
                  talents.gender,
                  talents.country_id,
                  talents.city_id,
                  talents.university_id,
                  countries.name as country,
                  h_index,
                  most_recent_pub,
                  document_count,
                  no_of_coauthor,
                  scopuses.scopus_id,
                  link_linkedin,
                  research_gate,
                  link_tnrr,
                  talents.firstname,
                  talents.lastname,
                  scopuses.id as id
                  from keywords
                  INNER join scopuses
                  on keywords.scopus_id = scopuses.id
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  INNER join countries
                  on talents.country_id = countries.id
                  ${where}
                  group by talents.id
                  order by h_index desc`
        const query = await db.sequelize.query(sql, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query.map((ele, index) => {
          return {
            id: ele.id,
            row: index,
            gender: ele.gender,
            country_id: ele.country_id,
            city_id: ele.city_id,
            university_id: ele.university_id,
            country: ele.country,
            h_index: ele.h_index,
            most_recent_pub: ele.most_recent_pub,
            document_count: ele.document_count,
            no_of_coauthor: ele.no_of_coauthor,
            firstname: ele.firstname,
            lastname: ele.lastname,
            scopus: !!ele.scopus_id,
            linkedin: !!ele.link_linkedin,
            research_gate: !!ele.research_gate,
            link_tnrr: !!ele.link_tnrr
          }
        })
        )
      }
      return res.json([])
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  showTalentProfile: async (req, res, next) => {
    const id = req.params.id
    const attributes = { exclude: ['scopus_id', 'keyword', 'talent_id', 'domain_industry', 'domain_industry_id', 'createdAt', 'updatedAt'] }
    const include = [
      {
        model: db.Keyword,
        attributes: ['keyword']
      },
      {
        model: db.Talent,
        attributes: ['firstname', 'lastname', 'link_linkedin', 'research_gate', 'link_tnrr', 'email'],
        include: [
          {
            model: db.City,
            attributes: ['name']
          },
          {
            model: db.Country,
            attributes: ['name']
          },
          {
            model: db.University,
            attributes: ['name']
          },
          {
            model: db.Collaboration,
            attributes: ['talent_id'],
            include: [
              {
                model: db.CoAuthor,
                attributes: { exclude: ['id'] },
                include: [
                  {
                    model: db.Talent,
                    attributes: ['id'],
                    include: [
                      {
                        model: db.Scopus,
                        attributes: ['id']
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: db.Img,
            attributes: ['url']
          }
        ]
      }
    ]
    try {
      const data = await model.findByPk(db.Scopus, id, res, include, attributes)
      data.Talent.link_linkedin = !!data.Talent.link_linkedin
      data.Talent.research_gate = !!data.Talent.research_gate
      data.Talent.link_tnrr = !!data.Talent.link_tnrr
      let keywordMerges = []
      for (const keyword of data.Keywords) {
        keywordMerges = [
          ...keywordMerges,
          ...keyword.keyword.split(';').map(ele => ele.trim())
        ]
      }
      data.keyword = keywordMerges.join('; ')
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  recommendation: async (req, res, next) => {
    const id = req.params.id
    const { group, size } = req.query

    const limit = size || 10
    let whereGroup = ''
    const replacementVal = {
      id
    }
    if (group) {
      whereGroup += ' and talents.talent_group = :group '
      replacementVal.group = group
    }
    try {
      const scopus = await model.findByPk(db.Scopus, id, res, [], ['id', 'keyword'])
      const sql = `SELECT 
                  scopuses.id as id,
                  keyword
                  from scopuses
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  where scopuses.id != :id 
                  ${whereGroup} 
                  group by talents.id
                  order by h_index desc`
      const query = await db.sequelize.query(sql, {
        replacements: replacementVal,
        type: QueryTypes.SELECT
      })

      const cosineLists = _.orderBy(query.map((ele) => {
        return {
          ...ele,
          cosine: cosine(scopus.keyword.split('; '), ele.keyword.split('; '))
        }
      }), ['cosine'], ['desc']).splice(0, limit)

      if (cosineLists.length > 0) {
        replacementVal.cosineIds = cosineLists.map(ele => ele.id)

        const sql2 = `SELECT 
                  talents.gender,
                  talents.country_id,
                  talents.city_id,
                  talents.university_id,
                  countries.name as country,
                  h_index,
                  most_recent_pub,
                  document_count,
                  no_of_coauthor,
                  scopuses.scopus_id,
                  link_linkedin,
                  research_gate,
                  link_tnrr,
                  talents.firstname,
                  talents.lastname,
                  scopuses.talent_id as talent_id,
                  scopuses.id as id
                  from keywords
                  INNER join scopuses
                  on keywords.scopus_id = scopuses.id
                  INNER join talents
                  on scopuses.talent_id = talents.id
                  INNER join countries
                  on talents.country_id = countries.id
                  where scopuses.id in (:cosineIds)
                  ${whereGroup}
                  group by talents.id
                  order by FIELD(scopuses.id,:cosineIds)`
        const query2 = await db.sequelize.query(sql2, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query2.map((ele, index) => {
          return {
            id: ele.id,
            talent_id: ele.talent_id,
            cos: (cosineLists[index] ? cosineLists[index].cosine : 0),
            row: index,
            gender: ele.gender,
            country_id: ele.country_id,
            city_id: ele.city_id,
            university_id: ele.university_id,
            country: ele.country,
            h_index: ele.h_index,
            most_recent_pub: ele.most_recent_pub,
            document_count: ele.document_count,
            no_of_coauthor: ele.no_of_coauthor,
            firstname: ele.firstname,
            lastname: ele.lastname,
            scopus: !!ele.scopus_id,
            linkedin: !!ele.link_linkedin,
            research_gate: !!ele.research_gate,
            link_tnrr: !!ele.link_tnrr
          }
        })
        )
      } else {
        return res.json([])
      }
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  searchLabMatching: async (req, res, next) => {
    const data = req.body

    try {
      if (data.search && data.search.trim().length > 0) {
        let where = 'where '
        const replacementVal = {
          search: `%${data.search.trim()}%`
        }
        if (data.searchType === 'all') {
          where += '(lab_locations.name like :search or machine_details.name like :search) '
        } else if (data.searchType === 'name') {
          where += 'lab_locations.name like :search '
        } else if (data.searchType === 'equipment') {
          where += 'machine_details.name like :search '
        }

        if (data.filterCountries.length > 0) {
          where += 'and lab_locations.country_id in (:country) '
          replacementVal.country = data.filterCountries
        }
        if (data.filterCities.length > 0) {
          where += 'and lab_locations.city_id in (:city) '
          replacementVal.city = data.filterCities
        }
        if (data.filterUniversities.length > 0) {
          where += 'and lab_locations.university_id in (:university) '
          replacementVal.university = data.filterUniversities
        }

        const sql = `SELECT 
                  lab_locations.id,
                  lab_locations.name,
                  lab_locations.lab_link,
                  lab_locations.phone,
                  lab_locations.email,
                  lab_locations.website,
                  lab_locations.country_id,
                  lab_locations.city_id,
                  lab_locations.university_id,
                  lab_locations.organization_type_id,
                  countries.name as country
                  from lab_locations
                  INNER join countries
                  on lab_locations.country_id = countries.id
                  INNER join machine_details
                  on machine_details.lab_location_id = lab_locations.id
                  ${where}
                  group by lab_locations.id
                  order by lab_locations.name asc`
        const query = await db.sequelize.query(sql, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query)
      }
      return res.json([])
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  searchTrainingMatching: async (req, res, next) => {
    const data = req.body

    try {
      if (data.search && data.search.trim().length > 0) {
        let where = 'where active = 1 and training_courses.name like :search '
        const replacementVal = {
          search: `%${data.search.trim()}%`
        }

        if (data.filterFormats.length > 0) {
          where += 'and training_courses.format in (:format)'
          replacementVal.format = data.filterFormats
        }
        if (data.filterCountries.length > 0) {
          where += 'and training_courses.country_id in (:country) '
          replacementVal.country = data.filterCountries
        }
        if (data.filterCities.length > 0) {
          where += 'and training_courses.city_id in (:city) '
          replacementVal.city = data.filterCities
        }
        if (data.filterUniversities.length > 0) {
          where += 'and training_courses.university_id in (:university) '
          replacementVal.university = data.filterUniversities
        }
        if (data.filterMinCost !== null) {
          where += 'and training_courses.cost >= :minCost '
          replacementVal.minCost = data.filterMinCost
        }
        if (data.filterMaxCost !== null) {
          where += 'and training_courses.cost <= :maxCost '
          replacementVal.maxCost = data.filterMaxCost
        }

        const sql = `SELECT 
                  training_courses.id,
                  training_courses.name,
                  training_courses.format,
                  training_courses.cost,
                  training_courses.instructor_name,
                  training_courses.start_date,
                  training_courses.country_id,
                  training_courses.city_id,
                  training_courses.university_id,
                  countries.name as country,
                  currencies.code as currency,
                  universities.name as university
                  from training_courses
                  INNER join countries
                  on training_courses.country_id = countries.id
                  INNER join currencies
                  on training_courses.currency_id = currencies.id
                  INNER join universities
                  on training_courses.university_id = universities.id
                  ${where}
                  order by training_courses.name asc`
        const query = await db.sequelize.query(sql, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query)
      }
      return res.json([])
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  searchFundingMatching: async (req, res, next) => {
    const data = req.body

    try {
      if (data.search && data.search.trim().length > 0) {
        let where = 'where funding_organizations.active = 1 and funding_organizations.name like :search '
        const replacementVal = {
          search: `%${data.search.trim()}%`
        }

        if (data.filterCountries.length > 0) {
          where += 'and funding_organizations.country_id in (:country) '
          replacementVal.country = data.filterCountries
        }
        if (data.filterCities.length > 0) {
          where += 'and funding_organizations.city_id in (:city) '
          replacementVal.city = data.filterCities
        }
        if (data.filterDepartments.length > 0) {
          where += 'and funding_organizations.department_id in (:department) '
          replacementVal.department = data.filterDepartments
        }
        if (data.filterMinBudget !== null) {
          where += 'and funding_organizations.budget >= :minBudget '
          replacementVal.minBudget = data.filterMinBudget
        }
        if (data.filterMaxBudget !== null) {
          where += 'and funding_organizations.budget <= :maxBudget '
          replacementVal.maxBudget = data.filterMaxBudget
        }

        const sql = `SELECT 
                  funding_organizations.id,
                  funding_organizations.name,
                  funding_organizations.description,
                  funding_organizations.department,
                  funding_organizations.open_date,
                  funding_organizations.deadline_date,
                  funding_organizations.budget,
                  funding_organizations.country_id,
                  funding_organizations.city_id,
                  funding_organizations.department_id,
                  funding_organizations.website,
                  funding_organizations.email,
                  countries.name as country,
                  departments.name as department,
                  currencies.code as currency
                  from funding_organizations
                  INNER join countries
                  on funding_organizations.country_id = countries.id
                  INNER join departments
                  on funding_organizations.department_id = departments.id
                  LEFT join currencies
                  on funding_organizations.currency_id = currencies.id
                  ${where}
                  order by funding_organizations.name asc`
        const query = await db.sequelize.query(sql, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query)
      }
      return res.json([])
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  searchPublicationMatching: async (req, res, next) => {
    const data = req.body

    try {
      if (data.search && data.search.trim().length > 0) {
        let where = 'where publications.active = 1 and '
        const replacementVal = {
          search: `%${data.search.trim()}%`
        }
        if (data.searchType === 'all') {
          where += '(publications.name like :search or journals.name like :search or publishers.name like :search) '
        } else if (data.searchType === 'name') {
          where += '(publications.name like :search) '
        } else if (data.searchType === 'journal') {
          where += 'journals.name like :search '
        } else if (data.searchType === 'publisher') {
          where += 'publishers.name like :search '
        }

        if (data.filterCountries.length > 0) {
          where += 'and publishers.country_id in (:country) '
          replacementVal.country = data.filterCountries
        }
        if (data.filterMinBudget !== null) {
          where += 'and publications.budget >= :minBudget '
          replacementVal.minBudget = data.filterMinBudget
        }
        if (data.filterMaxBudget !== null) {
          where += 'and publications.budget <= :maxBudget '
          replacementVal.maxBudget = data.filterMaxBudget
        }
        if (data.filterMinFrequencyPublish !== null) {
          where += 'and publications.frequency_publish >= :minFrequencyPublish '
          replacementVal.minFrequencyPublish = data.filterMinFrequencyPublish
        }
        if (data.filterMaxFrequencyPublish !== null) {
          where += 'and publications.frequency_publish >= :maxFrequencyPublish '
          replacementVal.maxFrequencyPublish = data.filterMaxFrequencyPublish
        }

        const sql = `SELECT 
                  publications.id,
                  publications.name,
                  publications.description,
                  publications.deadline_date,
                  publications.budget,
                  publications.journal_id,
                  journals.publisher_id,
                  publishers.country_id,
                  publications.frequency_publish,
                  publications.website,
                  publications.email,
                  journals.name as journal,
                  publishers.name as publisher,
                  countries.name as country,
                  currencies.code as currency
                  from publications
                  INNER join journals
                  on publications.journal_id = journals.id
                  INNER join publishers
                  on journals.publisher_id = publishers.id
                  INNER join countries
                  on publishers.country_id = countries.id
                  INNER join currencies
                  on publications.currency_id = currencies.id
                  ${where}
                  order by publications.name asc`
        const query = await db.sequelize.query(sql, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query)
      }
      return res.json([])
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  searchHostMatching: async (req, res, next) => {
    const data = req.body

    try {
      if (data.search && data.search.trim().length > 0) {
        let where = 'where hosts.active = 1 and '
        const replacementVal = {
          search: `%${data.search.trim()}%`
        }
        if (data.searchType === 'all') {
          where += '(hosts.name like :search or hosts.keyword like :search) '
        } else if (data.searchType === 'name') {
          where += '(hosts.name like :search) '
        } else if (data.searchType === 'keyword') {
          where += 'hosts.keyword like :search '
        }

        if (data.filterCountries.length > 0) {
          where += 'and hosts.country_id in (:country) '
          replacementVal.country = data.filterCountries
        }
        if (data.filterCities.length > 0) {
          where += 'and hosts.city_id in (:city) '
          replacementVal.city = data.filterCities
        }

        const sql = `SELECT 
                  hosts.id,
                  hosts.name,
                  hosts.description,
                  hosts.social_media_url,
                  hosts.keyword,
                  hosts.country_id,
                  hosts.city_id,
                  hosts.website,
                  hosts.email,
                  countries.name as country
                  from hosts
                  INNER join countries
                  on hosts.country_id = countries.id
                  ${where}
                  order by hosts.name asc`
        const query = await db.sequelize.query(sql, {
          replacements: replacementVal,
          type: QueryTypes.SELECT
        })
        return res.json(query)
      }
      return res.json([])
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  recommendationLab: async (req, res, next) => {
    const id = req.params.id
    const { size } = req.query

    const limit = size || 10
    const replacementVal = {
      id
    }
    try {
      const thisLab = await model.findByPk(db.LabLocation, id, res, [db.MachineDetail, db.University, db.Country])
      const labs = await db.LabLocation.findAll({
        attributes: ['id', 'name'],
        include: [
          {
            model: db.University,
            attributes: ['name']
          },
          {
            model: db.Country,
            attributes: ['name']
          },
          {
            model: db.MachineDetail,
            attributes: ['name']
          }
        ]
      })

      const cosineLists = _.orderBy(labs.filter(ele => ele.id !== id).map((ele) => {
        return {
          id: ele.id,
          machines: [...ele.MachineDetails.map(ele2 => ele2.name), ele.name, ele.University.name, ele.Country.name].join('; '),
          cosine: cosine([...thisLab.MachineDetails.map(ele2 => ele2.name), thisLab.name, thisLab.University.name, thisLab.Country.name], [...ele.MachineDetails.map(ele2 => ele2.name), ele.name, ele.University.name, ele.Country.name])
        }
      }), ['cosine'], ['desc']).splice(0, limit)

      replacementVal.cosineIds = cosineLists.map(ele => ele.id)

      const sql = `SELECT 
                  lab_locations.id,
                  lab_locations.name,
                  lab_locations.lab_link,
                  lab_locations.phone,
                  lab_locations.email,
                  lab_locations.website,
                  lab_locations.country_id,
                  lab_locations.city_id,
                  lab_locations.university_id,
                  lab_locations.organization_type_id,
                  countries.name as country
                  from lab_locations
                  INNER join countries
                  on lab_locations.country_id = countries.id 
                  where lab_locations.id in (:cosineIds) 
                  and lab_locations.id != :id
                  order by FIELD(lab_locations.id,:cosineIds)`
      const query = await db.sequelize.query(sql, {
        replacements: replacementVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  recommendationTraining: async (req, res, next) => {
    const id = req.params.id
    const { size } = req.query

    const limit = size || 10
    const replacementVal = {
      id
    }
    try {
      const thisLab = await model.findByPk(db.TrainingCourse, id, res, [db.University, db.Country])
      const trainings = await db.TrainingCourse.findAll({
        where: { active: true },
        attributes: ['id', 'name'],
        include: [
          {
            model: db.University,
            attributes: ['name']
          },
          {
            model: db.Country,
            attributes: ['name']
          }
        ]
      })

      const cosineLists = _.orderBy(trainings.filter(ele => ele.id !== id).map((ele) => {
        return {
          id: ele.id,
          cosine: cosine([thisLab.name, thisLab.University.name, thisLab.Country.name], [ele.name, ele.University.name, ele.Country.name])
        }
      }), ['cosine'], ['desc']).splice(0, limit)

      replacementVal.cosineIds = cosineLists.map(ele => ele.id)

      const sql = `SELECT 
                    training_courses.id,
                    training_courses.name,
                    training_courses.format,
                    training_courses.cost,
                    training_courses.instructor_name,
                    training_courses.start_date,
                    training_courses.country_id,
                    training_courses.city_id,
                    training_courses.university_id,
                    countries.name as country,
                    currencies.code as currency,
                    universities.name as university
                    from training_courses
                    INNER join countries
                    on training_courses.country_id = countries.id
                    INNER join currencies
                    on training_courses.currency_id = currencies.id
                    INNER join universities
                    on training_courses.university_id = universities.id
                    where active = 1
                    and training_courses.id in (:cosineIds) 
                    and training_courses.id != :id
                    order by FIELD(training_courses.id,:cosineIds)`
      const query = await db.sequelize.query(sql, {
        replacements: replacementVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  recommendationFunding: async (req, res, next) => {
    const id = req.params.id
    const { size } = req.query

    const limit = size || 10
    const replacementVal = {
      id
    }
    try {
      const thisLab = await model.findByPk(db.FundingOrganization, id, res, [db.Country, db.Department])
      const trainings = await db.FundingOrganization.findAll({
        where: { active: true },
        attributes: ['id', 'name'],
        include: [
          {
            model: db.Country,
            attributes: ['name']
          },
          {
            model: db.Department,
            attributes: ['name']
          }
        ]
      })

      const cosineLists = _.orderBy(trainings.filter(ele => ele.id !== id).map((ele) => {
        return {
          id: ele.id,
          cosine: cosine([thisLab.name, thisLab.Department.name, thisLab.Country.name], [ele.name, ele.Department.name, ele.Country.name])
        }
      }), ['cosine'], ['desc']).splice(0, limit)

      replacementVal.cosineIds = cosineLists.map(ele => ele.id)

      const sql = `SELECT 
                    funding_organizations.id,
                    funding_organizations.name,
                    funding_organizations.description,
                    funding_organizations.department,
                    funding_organizations.open_date,
                    funding_organizations.deadline_date,
                    funding_organizations.budget,
                    funding_organizations.country_id,
                    funding_organizations.department_id,
                    funding_organizations.city_id,
                    funding_organizations.website,
                    funding_organizations.email,
                    countries.name as country,
                    departments.name as department,
                    currencies.code as currency
                    from funding_organizations
                    INNER join countries
                    on funding_organizations.country_id = countries.id
                    INNER join departments
                    on funding_organizations.department_id = departments.id
                    INNER join currencies
                    on funding_organizations.currency_id = currencies.id
                    where funding_organizations.id in (:cosineIds) 
                    and funding_organizations.id != :id
                    and funding_organizations.active = 1
                    order by FIELD(funding_organizations.id,:cosineIds)`
      const query = await db.sequelize.query(sql, {
        replacements: replacementVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  recommendationPublication: async (req, res, next) => {
    const id = req.params.id
    const { size } = req.query

    const limit = size || 10
    const replacementVal = {
      id
    }
    try {
      const thisLab = await model.findByPk(db.Publication, id, res, [
        {
          model: db.Journal,
          attributes: ['name'],
          include: [
            {
              model: db.Publisher,
              attributes: ['name'],
              include: [
                {
                  model: db.Country,
                  attributes: ['name']
                }
              ]
            }
          ]
        }
      ])
      const trainings = await db.Publication.findAll({
        where: { active: true },
        attributes: ['id', 'name'],
        include: [
          {
            model: db.Journal,
            attributes: ['name'],
            include: [
              {
                model: db.Publisher,
                attributes: ['name'],
                include: [
                  {
                    model: db.Country,
                    attributes: ['name']
                  }
                ]
              }
            ]
          }
        ]
      })

      const cosineLists = _.orderBy(trainings.filter(ele => ele.id !== id).map((ele) => {
        return {
          id: ele.id,
          cosine: cosine([thisLab.name, thisLab.Journal.name, thisLab.Journal.Publisher.name, thisLab.Journal.Publisher.Country.name], [ele.name, ele.Journal.name, ele.Journal.Publisher.name, ele.Journal.Publisher.Country.name])
        }
      }), ['cosine'], ['desc']).splice(0, limit)

      replacementVal.cosineIds = cosineLists.map(ele => ele.id)

      const sql = `SELECT 
                    publications.id,
                    publications.name,
                    publications.description,
                    publications.deadline_date,
                    publications.budget,
                    publications.journal_id,
                    journals.publisher_id,
                    publishers.country_id,
                    publications.frequency_publish,
                    publications.website,
                    publications.email,
                    journals.name as journal,
                    publishers.name as publisher,
                    countries.name as country,
                    currencies.code as currency
                    from publications
                    INNER join journals
                    on publications.journal_id = journals.id
                    INNER join publishers
                    on journals.publisher_id = publishers.id
                    INNER join countries
                    on publishers.country_id = countries.id
                    INNER join currencies
                    on publications.currency_id = currencies.id
                    where publications.id in (:cosineIds) 
                    and publications.id != :id
                    and publications.active = 1
                    order by FIELD(publications.id,:cosineIds)`
      const query = await db.sequelize.query(sql, {
        replacements: replacementVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  recommendationHost: async (req, res, next) => {
    const id = req.params.id
    const { size } = req.query

    const limit = size || 10
    const replacementVal = {
      id
    }
    try {
      const thisLab = await model.findByPk(db.Host, id, res, [db.Country])
      const trainings = await db.Host.findAll({
        where: { active: true },
        attributes: ['id', 'name', 'keyword'],
        include: [
          {
            model: db.Country,
            attributes: ['name']
          }
        ]
      })

      const cosineLists = _.orderBy(trainings.filter(ele => ele.id !== id).map((ele) => {
        return {
          id: ele.id,
          cosine: cosine([thisLab.name, thisLab.keyword, thisLab.Country.name], [ele.name, ele.keyword, ele.Country.name])
        }
      }), ['cosine'], ['desc']).splice(0, limit)

      replacementVal.cosineIds = cosineLists.map(ele => ele.id)

      const sql = `SELECT 
                    hosts.id,
                    hosts.name,
                    hosts.description,
                    hosts.social_media_url,
                    hosts.keyword,
                    hosts.country_id,
                    hosts.city_id,
                    hosts.website,
                    hosts.email,
                    countries.name as country
                    from hosts
                    INNER join countries
                    on hosts.country_id = countries.id
                    where hosts.id in (:cosineIds) 
                    and hosts.id != :id
                    and hosts.active = 1
                    order by FIELD(hosts.id,:cosineIds)`
      const query = await db.sequelize.query(sql, {
        replacements: replacementVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
