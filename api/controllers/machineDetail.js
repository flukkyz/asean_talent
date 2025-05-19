const { Validator } = require('node-input-validator')
const db = require('../models')
const { model } = require('../helpers')
const MachineDetail = db.MachineDetail

module.exports = {
  inputValidate: async (req, res, next) => {
    const v = new Validator(req.body, MachineDetail.inputSchema)
    const matched = await v.check()
    if (matched) {
      next()
    } else {
      return res.status(400).json({
        message: 'Bad request.' + v.errors
      })
    }
  },
  store: async (req, res, next) => {
    const data = req.body
    try {
      const newData = await db.sequelize.transaction((t) => {
        return MachineDetail.create(data, {
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      e.message = 'Cannot store data from database.'
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    try {
      await db.sequelize.transaction((t) => {
        return MachineDetail.update(
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
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await model.findByPk(MachineDetail, id, res)
    try {
      await oldData.destroy()
      return res.status(204).send()
    } catch (e) {
      e.message = 'Cannot remove data from database.'
      next(e)
    }
  }
}
