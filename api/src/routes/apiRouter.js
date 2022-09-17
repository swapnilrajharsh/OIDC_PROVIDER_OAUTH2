const express = require('express')
const router = express.Router()
const { apiController } = require('../controllers/apiController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.post('/resource', authMiddleware, apiController)

module.exports = router