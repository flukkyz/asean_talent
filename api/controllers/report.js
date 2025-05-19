const db = require('../models')
const QueryTypes = db.Sequelize.QueryTypes

module.exports = {
  socialNetworkAnalysis: async (req, res, next) => {
    const slug = req.params.slug
    const bindVal = {
      keyword1: `%; ${slug};%`,
      keyword2: `%;${slug};%`,
      keyword3: `%; ${slug}`,
      keyword4: `%;${slug}`,
      keyword5: `${slug};%`,
      keyword6: `${slug}`
    }

    const sql = `SELECT
                name,
                CONCAT (co_authors.firstname,'  ', co_authors.lastname) as co
                FROM (
                  SELECT
                  talents.id as id,
                  CONCAT (talents.firstname,'  ', talents.lastname) as name
                  FROM talents 
                  INNER join scopuses
                  on scopuses.talent_id = talents.id
                  INNER join keywords
                  on keywords.scopus_id = scopuses.id
                  where keywords.keyword like $keyword1
                  or keywords.keyword like $keyword2
                  or keywords.keyword like $keyword3
                  or keywords.keyword like $keyword4
                  or keywords.keyword like $keyword5
                  or keywords.keyword = $keyword6
                  GROUP by talent_id ) as new_talent
                INNER join collaborations
                on collaborations.talent_id = new_talent.id
                INNER join co_authors
                on collaborations.co_author_id = co_authors.id`
    try {
      const query = await db.sequelize.query(sql, {
        bind: bindVal,
        type: QueryTypes.SELECT
      })
      return res.json(query)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  }
}
