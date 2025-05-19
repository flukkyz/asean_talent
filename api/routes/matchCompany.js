const express = require('express')
const { matchCompanyController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/match-companies'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), matchCompanyController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), matchCompanyController.index)
router.get(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, matchCompanyController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('company_img'), checkBody, matchCompanyController.inputValidate, matchCompanyController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, matchCompanyController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('company_img'), checkParamId, checkBody, matchCompanyController.inputValidate, matchCompanyController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, matchCompanyController.inputValidate, matchCompanyController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, matchCompanyController.destroy)

module.exports = router
