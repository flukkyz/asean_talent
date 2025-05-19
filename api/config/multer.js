const fs = require('fs')
const randomstring = require('randomstring')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `./static/uploads/${file.fieldname
      .replace('_img', 's')
      .replace('_file', 's')
      .replace('_logo', 's')}`
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    if (req.body && req.body.upload_filename) {
      cb(null, req.body.upload_filename)
    } else {
      const mimetypes = {
        'image/png': '.png',
        'image/gif': '.gif',
        'image/jpg': '.jpg',
        'image/jpeg': '.jpg',
        'application/pdf': '.pdf'
      }
      const random = randomstring.generate(6)
      cb(null, new Date().getTime() + '-' + random + mimetypes[file.mimetype])
    }
  }
})

const fileFilter = (req, file, cb) => {
  const mimetypeImages = ['image/png', 'image/gif', 'image/jpg', 'image/jpeg', 'application/pdf']
  // const fieldImages = [
  //   'blog_img',
  //   'alliance_img',
  //   'home_img',
  //   'utilization_img',
  //   'editor_img',
  //   'funding_img'
  // ]
  // if (fieldImages.includes(file.fieldname)) {
  cb(null, mimetypeImages.includes(file.mimetype))
  // }
}

module.exports = multer({
  storage,
  fileFilter
})
