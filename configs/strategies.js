const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { sign } = require('jsonwebtoken');
const JwtSecret = process.env.SECRET_TOKEN;
const { findUser, addToken, checkToken } = require('../api/users/user.service');
const { hashSync, genSaltSync, compareSync } = require('bcryptjs');
const util = require('util');

const findUserPromise = util.promisify(findUser);
const checkTokenPromise = util.promisify(checkToken);
const addTokenPromise = util.promisify(addToken);

// JWT Strategy
passport.use('validateJwt', new JwtStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
	secretOrKey: JwtSecret,
	passReqToCallback: true,
}, async (req, payload, done) => {
	try {
		// Find the user specified in token
		const user = await findUserPromise(payload.user_id);
		if (!user)
			return done(null, { message: 'Invalid User Id or Password' });

		// Check if token has been changed!
		token = req.get('authorization');
		token = token.slice(7);
		const validateToken = await checkTokenPromise(user.user_id, token);
		if (!validateToken) {
			return done(null, { message: 'This token is no more valid, Please Login Again!' });
		}

		return done(null, user);
	} catch (error) {
		done(error);
	}
}));

// Local Strategy
passport.use('login', new LocalStrategy({
	usernameField: 'user_id',
    passwordField: 'password',
}, async (user_id, password, done) => {
	try {
        const user = await findUserPromise(user_id);
		if (!user) {
			return done(null, { message: 'Invalid User Id or Password' });
		}

		const validate = compareSync(password, user.password);
		if (validate) {
			user.password = undefined;
			// Return Json Token for login
			const jsontoken = sign(user, JwtSecret, {
				expiresIn: "365d"
			});	
			const result = await addTokenPromise(user_id, jsontoken);
			return done(null, { data: jsontoken });
		} else {
			return done(null, { message: 'Invalid User Id or Password' });
		}
        
	} catch (error) {
		done(error);
	}
}));