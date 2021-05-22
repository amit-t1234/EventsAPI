const pool = require('../../configs/database');

module.exports = {
    createUser: (data, callBack) => {
        pool.query(
            `INSERT INTO users (user_id, password) VALUES ($1, $2)`,
            [
                data.user_id,
                data.password,
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
    findUser: (user_id, callBack) => {
        pool.query(
            `SELECT * FROM users WHERE user_id = $1`,
            [
                user_id,
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows[0]);
            }
        );
    },
    updatePassword: (user_id, password, callBack) => {
        pool.query(
            `UPDATE users SET password = $1 WHERE user_id = $2`,
            [
                password,
                user_id,
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
    addToken: (user_id, token, callBack) => {
        pool.query(
            `INSERT INTO token_store (user_id, token) VALUES ($1, $2)`,
            [
                user_id,
                token,
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows);
            }
        );
    },
    checkToken: (user_id, token, callBack) => {
        pool.query(
            `SELECT * FROM token_store WHERE user_id = $1 and token = $2`,
            [
                user_id,
                token
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows[0]);
            }
        );
    },
    deleteToken: (user_id, token, callBack) => {
        pool.query(
            `DELETE FROM token_store WHERE user_id = $1 and token = $2`,
            [
                user_id,
                token
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows[0]);
            }
        );
    },
    deleteAllToken: (user_id, callBack) => {
        pool.query(
            `DELETE FROM token_store WHERE user_id = $1`,
            [
                user_id,
            ],
            (error, result) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, result.rows[0]);
            }
        );
    },
}