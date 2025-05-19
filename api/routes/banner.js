const express = require('express')
const { bannerController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/banners'

router.get(`${path}/`, bannerController.index)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, upload.single('banner_img'), checkBody, bannerController.store)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, bannerController.destroy)

module.exports = router
