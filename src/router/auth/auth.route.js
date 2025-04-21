const express = require('express')
const router = express.Router()
const {asyncHandler} = require('../../utils/asyncHandler')
const AccessController = require('../../controllers/access.controller')

// signup
router.post('/signup', asyncHandler(AccessController.signUp))
// login
router.post('/login', asyncHandler(AccessController.login))

module.exports = router