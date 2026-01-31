const express = require('express')
const { blogCategoryController } = require('../controllers')

const passport = require('../config/passport')
const { checkBody, checkParamId, checkRoleAdmin } = require('../middlewares')

const router = express.Router()

const path = '/blog-categories'

router.get(`${path}-count`, blogCategoryController.count)
router.get(`${path}/`, blogCategoryController.index)
router.get(`${path}/:id`, checkParamId, blogCategoryController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkBody, blogCategoryController.inputValidate, blogCategoryController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, blogCategoryController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, checkBody, blogCategoryController.inputValidate, blogCategoryController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkRoleAdmin, checkParamId, blogCategoryController.destroy)

module.exports = router
