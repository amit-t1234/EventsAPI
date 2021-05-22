const pool = require('../../configs/database');

module.exports = {
    createEvent: (data, callBack) => {
        pool.query(
            `INSERT INTO events (name, description, user_id) VALUES ($1, $2, $3)`,
            [
                data.name,
                data.description || 'NA',
                data.user_id
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
    findEvent: (user_id, event_no, callBack) => {
        pool.query(
            `SELECT * FROM events WHERE user_id = $1 AND event_no = $2`,
            [
                user_id,
                event_no
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
    getEvents: (data, callBack) => {
        pool.query(
            `SELECT events.event_no, name, description, invitee as invited_by, events.created_at as created_at, invites.created_at as invited_at 
            FROM events full outer join invites
            ON
            events.event_no = invites.event_no
            WHERE 
            ${data.name ? 'name LIKE $3 AND': '$3 = $3 AND'}
            ${data.description ? 'description LIKE $4 AND': '$4 = $4 AND'}
            ${data.created_from ? 'events.created_at >= $5 AND': '$5 = $5 AND'}
            ${data.created_to ? 'events.created_at <= $6 AND': '$6 = $6 AND'}
            (user_id = $1 OR invited = $2)
            ORDER BY events.created_at ${data.accending ? 'ASC': 'DESC'} 
            OFFSET $7 LIMIT $8`,
            [
                data.user_id,
                data.user_id,
                "%" + data.name  + "%",
                "%" + data.description  + "%",
                data.created_from || "",
                data.created_to || "",
                data.offset || 0,
                data.page_size || 20,
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
    inviteUsers: (data, callBack) => {
        // from my solution 2. use the invites.length params to populate the bind params variable in query string
        let sqlQuery = `INSERT INTO invites (event_no, invitee, invited) VALUES `
        for (let i = 0; i < data.length; i+=3) {
            sqlQuery += `($${i + 1}, $${i + 2}, $${i + 3}), `
        }
        sqlQuery = sqlQuery.slice(0, -2);

        pool.query(
            sqlQuery,
            data,
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
}