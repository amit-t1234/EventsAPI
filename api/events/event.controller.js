const { createEvent, getEvents, inviteUsers, findEvent } = require('./event.service');
const util = require('util');

const createEventPromise = util.promisify(createEvent);
const getEventsPromise = util.promisify(getEvents);
const inviteUsersPromise = util.promisify(inviteUsers);
const findEventPromise = util.promisify(findEvent);

module.exports = {
    createEvent: async (req, res) => {
        try {
            let body = req.body;
            body.user_id = req.user.user_id;
            // TODO: Check body

            // Insert the event
            const result = await createEventPromise(body);
            return res.status(200).json({
                success: 1,
                message: "Event Successfully Created!"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: 0,
                message: error.message
            })
        }
    },
    getEvents: async (req, res) => {
        try {
            let body = req.body;
            body.user_id = req.user.user_id;
            // TODO: Check body

            // get events
            const events = await getEventsPromise(body);
            return res.status(200).json({
                success: 1,
                data: events
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: 0,
                message: error.message
            })
        }
    },
    inviteUsers: async (req, res) => {
        try {
            let body = req.body;
            body.user_id = req.user.user_id;

            // Check if invite is array or jsonencoded array
            body.invites = Array.isArray(body.invites)? body.invites: JSON.parse(body.invites);
            if (!body.invites || !body.invites.length) {
                return res.status(500).json({
                    success: 0,
                    message: "Number of invites needs to be greater than 1"
                })
            }
            
            /*
                A little trick for bulk insert in a single visit to database,
                though I would say a better solution would be use something like pg-promise package but I didn't
                wanted to change to another package for just a single query so here is a little bit complex solution
                1. prepare the bind params array which will look similar to [e1, u1, i1, e2, u2, i2...] to help pg
                2. use the invites.length params to populate the bind params variable in query string
            */

            // 1. prepare the bind params array which will look similar to [e1, u1, i1, e2, u2, i2...] to help pg
            let bindParams = [];
            body.invites.forEach(invited => {
                bindParams.push(body.event_no, body.user_id, invited);
            });

            // TODO: Check body

            // Check if the event is created by this user
            const event = await findEventPromise(body.user_id, body.event_no);
            if (!event.length) {
                return res.status(500).json({
                    success: 0,
                    message: "You don't have any events with that number!"
                }) 
            }

            // Insert the users ids to events
            const events = await inviteUsersPromise(bindParams);
            return res.status(200).json({
                success: 1,
                message: "Invites Added"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: 0,
                message: error.message
            })
        }
    }
}