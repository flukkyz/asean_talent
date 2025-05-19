const express = require('express')
const { processDbController } = require('../controllers')

const passport = require('../config/passport')
const { checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/process-db'

router.get(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, (req, res, next) => {
  if (req.user.role === 'secret') {
    next()
  } else {
    return res.status(403).json({
      message: 'Forbidden.'
    })
  }
}, processDbController.index)

module.exports = router
