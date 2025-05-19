module.exports = (req, res, next) => {
  if (['secret', 'admin'].includes(req.user.role)) {
    next()
  } else {
    return res.status(403).json({
      message: 'Forbidden.'
    })
  }
}
