const _ = require('lodash')
const db = require('../models')
const DomainIndustry = db.DomainIndustry
const ListKeyword = db.ListKeyword
const IndustryKeyword = db.IndustryKeyword

const findListKeyword = async (keyword) => {
  return await ListKeyword.findOne({
    where: {
      keyword: keyword.trim()
    },
    include: IndustryKeyword
  })
}

const findIndustryKeyword = (industryKeywords, domainIndustryId) => {
  return _.find(industryKeywords, { domain_industry_id: domainIndustryId })
}

const updateListKeywordWeight = async (id, amount) => {
  const data = await ListKeyword.findByPk(id)
  if (amount < 0 && data.weight === 1) {
    data.destroy()
  } else {
    await ListKeyword.update({
      weight: data.weight + amount
    }, {
      where: {
        id
      }
    })
  }
}

module.exports = {
  addKeyword: async (group, industries, keyword) => {
    const data = await findListKeyword(keyword)
    const domainIndustries = await DomainIndustry.findAll()
    if (data) {
      for (const domainIndustry of domainIndustries) {
        if (industries.includes(domainIndustry.name)) {
          const industryKeyword = findIndustryKeyword(data.IndustryKeywords, domainIndustry.id)
          if (industryKeyword) {
            await IndustryKeyword.update({
              weight: industryKeyword.weight + 1
            }, {
              where: {
                domain_industry_id: domainIndustry.id,
                list_keyword_id: data.id,
                talent_group: group
              }
            })
          } else {
            await IndustryKeyword.create({
              domain_industry_id: domainIndustry.id,
              list_keyword_id: data.id,
              talent_group: group
            })
          }
          await updateListKeywordWeight(data.id, 1)
        }
      }
    } else {
      const IndustryKeywords = domainIndustries.filter(ele => industries.includes(ele.name)).map((ele) => {
        return {
          domain_industry_id: ele.id,
          talent_group: group
        }
      })
      await ListKeyword.create({
        keyword: keyword.trim(),
        weight: IndustryKeywords.length,
        IndustryKeywords
      }, {
        include: IndustryKeyword
      })
    }
  },
  removeKeyword: async (group, industries, keyword) => {
    const data = await findListKeyword(keyword)
    if (data) {
      const domainIndustries = await DomainIndustry.findAll()
      for (const domainIndustry of domainIndustries) {
        if (industries.includes(domainIndustry.name)) {
          const industryKeyword = findIndustryKeyword(data.IndustryKeywords, domainIndustry.id)
          if (industryKeyword) {
            if (industryKeyword.weight > 1) {
              await IndustryKeyword.update({
                weight: industryKeyword.weight - 1
              }, {
                where: {
                  domain_industry_id: domainIndustry.id,
                  list_keyword_id: data.id,
                  talent_group: group
                }
              })
            } else {
              await IndustryKeyword.destroy({
                where: {
                  domain_industry_id: domainIndustry.id,
                  list_keyword_id: data.id,
                  talent_group: group
                }
              })
            }
            await updateListKeywordWeight(data.id, -1)
          }
        }
      }
    }
  }
}
