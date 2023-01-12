const router = require('express').Router()
const passport = require('passport')
const catchAsync = require('../utils/handle')
const { isLogedIn } = require('../midlleware')
const { renderRegister, register, login, renderLogin, logout,userCamps } = require('../controllers/user.controller')
router.get('/register', catchAsync(renderRegister))

router.post('/register', catchAsync(register))

router.get('/login', catchAsync(renderLogin))
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), login)
router.get('/mycamps',isLogedIn,catchAsync(userCamps))
router.get('/logout', catchAsync(logout))

module.exports = router;