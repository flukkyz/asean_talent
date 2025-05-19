const express = require('express')
const { trainingCourseController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/training-courses'

router.get(`${path}-count`, passport.authenticate('bearer', { session: false }), trainingCourseController.count)
router.get(`${path}/`, passport.authenticate('bearer', { session: false }), trainingCourseController.index)
router.get(`${path}/:id`, checkParamId, trainingCourseController.show)
router.post(`${path}/`, passport.authenticate('bearer', { session: false }), upload.single('training_img'), checkBody, trainingCourseController.inputValidate, trainingCourseController.store)
router.post(`${path}-lists`, passport.authenticate('bearer', { session: false }), checkBody, trainingCourseController.storeList)
router.put(`${path}/:id`, passport.authenticate('bearer', { session: false }), upload.single('training_img'), checkParamId, checkBody, trainingCourseController.inputValidate, trainingCourseController.update)
router.put(`${path}/:id/remove-image`, passport.authenticate('bearer', { session: false }), checkParamId, checkBody, trainingCourseController.inputValidate, trainingCourseController.removeImage)
router.delete(`${path}/:id`, passport.authenticate('bearer', { session: false }), checkParamId, trainingCourseController.destroy)

module.exports = router
