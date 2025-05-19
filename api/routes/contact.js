const express = require('express')
const mailer = require('../config/mailer')

const router = express.Router()

const { checkBody } = require('../middlewares')

const sendMail = async (from, subject, html) => {
  try {
    const mail = await mailer.sendMail({
      from,
      to: process.env.APP_EMAIL,
      subject,
      html
    })
    console.log(mail.messageId)
  } catch (err) {
    console.log(err)
  }
}

router.post('/contact', checkBody, async (req, res, next) => {
  const data = req.body
  await sendMail(`${data.name} <${data.email}>`, `Suggestion from custommer: ${data.title}`, `<h2>${data.title}</h2><br/> <p>${data.note}</p>`)
  res.status(204).send()
})

module.exports = router
