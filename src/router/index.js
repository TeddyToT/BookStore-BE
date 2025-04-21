const express = require('express')
const router = express.Router()


router.use('/v1/api', require('./auth/auth.route'))

router.use('/v1/api/user', require('./user/user.router'))


module.exports = router