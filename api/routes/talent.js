const express = require('express')
const { talentController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/talents'

router.get(`${path}-count`, talentController.count)
router.get(`${path}-count-industries`, talentController.countByIndustry)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), talentController.index)
router.get(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, talentController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('talent_img'), checkBody, talentController.inputValidate, talentController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, talentController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('talent_img'), checkParamId, checkBody, talentController.inputValidate, talentController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, talentController.inputValidate, talentController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, talentController.destroy)

module.exports = router
