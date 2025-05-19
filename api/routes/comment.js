const express = require('express')
const { commentController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/comments'

router.get(`${path}/:id`, checkParamId, commentController.index)
router.post(`${path}/`, passport.authenticate('bearer-member', { session: false }), checkBody, commentController.inputValidate, commentController.store)
router.put(`${path}/:id`, passport.authenticate('bearer-member', { session: false }), checkParamId, checkBody, commentController.inputValidate, commentController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer-member', { session: false }), checkParamId, commentController.destroy)

router.get(`${path}-admin/:id`, checkParamId, commentController.indexAdmin)
router.delete(`${path}-admin/:id`, passport.authenticate('bearer', { session: false }), checkParamId, commentController.destroy)

module.exports = router
