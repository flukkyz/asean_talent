const express = require('express')
const { forumController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId, checkParamSlug } = require('../middlewares')

const router = express.Router()

const path = '/forums'

router.get(`${path}/`, forumController.index)
router.get(`${path}/:slug`, checkParamSlug, forumController.show)
router.post(`${path}/`, passport.authenticate('bearer-member', { session: false }), upload.single('forum_img'), checkBody, forumController.inputValidate, forumController.store)
router.put(`${path}/:id`, passport.authenticate('bearer-member', { session: false }), upload.single('forum_img'), checkParamId, checkBody, forumController.inputValidate, forumController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer-member', { session: false }), checkParamId, checkBody, forumController.inputValidate, forumController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer-member', { session: false }), checkParamId, forumController.destroy)

router.get(`${path}-admin/`, passport.authenticate('bearer', { session: false }), forumController.indexAdmin)
router.get(`${path}-admin/:slug`, passport.authenticate('bearer', { session: false }), checkParamSlug, forumController.showAdmin)
router.delete(`${path}-admin/:id`, passport.authenticate('bearer', { session: false }), checkParamId, forumController.destroy)

module.exports = router
