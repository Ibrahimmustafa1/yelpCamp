const router = require('express').Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { isLogedIn } = require('../midlleware')
const { renderRegister, register, login, renderLogin, logout,userCamps } = require('../controllers/user.controller')
router.get('/register', renderRegister)

router.post('/register', catchAsync(register))

router.get('/login', renderLogin)
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), login)
router.get('/mycamps',isLogedIn,userCamps)
router.get('/logout', logout)

module.exports = router;