module.exports = (req, res, next) => {
  if (['secret'].includes(req.user.role)) {
    next()
  } else {
    return res.status(403).json({
      message: 'Forbidden.'
    })
  }
}
