const express = require('express')
const { settingController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/setting'

router.get(`${path}/`, settingController.index)
router.put(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, settingController.update)

module.exports = router
