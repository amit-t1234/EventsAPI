const { createUser, login, updatePassword, logout } = require('./user.controller');
const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../../configs/strategies');
const validateJwt = passport.authenticate('validateJwt', { session: false });
const loginMiddleware = passport.authenticate('login', { session: false, });

router.post('/', createUser);
router.patch('/', validateJwt, updatePassword);
router.post('/login', loginMiddleware, login);
router.post('/logout', validateJwt, logout);

module.exports = router;