
const schedule = require('node-schedule')
const dayjs = require('dayjs')
const db = require('../models')
const Op = db.Sequelize.Op

const worker = () => {
  schedule.scheduleJob('50 0 0 * * *', () => {
    // every day at midnight
    run()
  })
  schedule.scheduleJob('50 5 0 * * *', () => {
    // every day at midnight
    run()
  })
  schedule.scheduleJob('50 10 0 * * *', () => {
    // every day at midnight
    run()
  })
  schedule.scheduleJob('50 10 1 * * *', () => {
    // every day at midnight
    run()
  })
  schedule.scheduleJob('50 10 2 * * *', () => {
    // every day at midnight
    run()
  })
}

const models = [
  db.Host,
  db.Support,
  db.Manage,
  db.FundingOrganization,
  db.LabLocation,
  db.TrainingCourse,
  db.Publication,
  db.MatchCompany,
  db.Blog
]

const run = async () => {
  try {
    for (const model of models) {
      await model.update({ active: false, expired_at: null }, {
        where: {
          active: true,
          expired_at: {
            [Op.lte]: dayjs().format('YYYY-MM-DD HH:mm:ss')
          }
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  worker,
  run
}
