require('custom-env').env('development'); // CHANGE THIS TO PRODUCTION IN PRODUCTION OR USE SET ENV VARIABLE IN package.json
const express 		= require('express'),
      cors          = require('cors'),
	  server 			= express(),
	  userRouter 	= require('./api/users/user.router'),
      eventRouter 	= require('./api/events/event.router');

server.use(express.json({parameterLimit: 500000, limit: '50mb'})); // support json encoded bodies
server.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 500000 })); // support encoded bodies

server.use(cors());

server.use('/api/user', userRouter);
server.use('/api/event', eventRouter);

server.get('*', (req, res) => {
	return res.json({
        success: 0,
        message: 'Invalid Route!',
        proverb: 'Not all ~paths~ routes lead to success'
    });
});

server.listen(process.env.SERVER_PORT, () => {
	console.log('🚀 SERVER UP AND RUNNING ON PORT:', process.env.SERVER_PORT);
});

// INCASE WE NEED TO TEST WHOLE server module
module.exports = server;