const express = require('express')
const { youngTalentController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/young-talents'

router.get(`${path}-count`, youngTalentController.count)
router.get(`${path}-count-industries`, youngTalentController.countByIndustry)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), youngTalentController.index)
router.get(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, youngTalentController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('talent_img'), checkBody, youngTalentController.inputValidate, youngTalentController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, youngTalentController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('talent_img'), checkParamId, checkBody, youngTalentController.inputValidate, youngTalentController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, youngTalentController.inputValidate, youngTalentController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, youngTalentController.destroy)

module.exports = router
