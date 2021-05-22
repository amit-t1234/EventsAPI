const { createEvent, getEvents, inviteUsers } = require('./event.controller');
const router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../../configs/strategies');
const validateJwt = passport.authenticate('validateJwt', { session: false });

router.post('/', validateJwt, createEvent);
router.get('/', validateJwt, getEvents);
router.post('/invite', validateJwt, inviteUsers);

module.exports = router;