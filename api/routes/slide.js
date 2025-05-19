const express = require('express')
const { slideController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/slides'

router.get(`${path}/`, slideController.index)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('slide_img'), checkBody, slideController.store)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, slideController.destroy)

module.exports = router
