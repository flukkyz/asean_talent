const nodemailer = require('nodemailer')

// กำหนดค่าเกี่ยวกับ email ที่จะใช้ส่ง
const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD
  }
})

module.exports = transporter
