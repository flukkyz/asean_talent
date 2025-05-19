const db = require('../models')
const { model } = require('../helpers')
const Setting = db.Setting

module.exports = {
  index: async (req, res, next) => {
    try {
      const data = await model.findByPk(Setting, 1, res)
      return res.json(data)
    } catch (e) {
      e.message = 'Cannot get data from database. Error: ' + e
      next(e)
    }
  },
  update: async (req, res, next) => {
    const data = req.body
    try {
      await db.sequelize.transaction(async (t) => {
        return await Setting.update(
          data, {
            where: {
              id: 1
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
  }
}
