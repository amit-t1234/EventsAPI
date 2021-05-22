const { createUser, findUser, deleteToken, deleteAllToken, updatePassword } = require('./user.service');
const util = require('util');
const { hashSync, genSaltSync, compareSync } = require('bcryptjs');

const createUserPromise = util.promisify(createUser);
const findUserPromise = util.promisify(findUser);
const deleteTokenPromise = util.promisify(deleteToken);
const deleteAllTokenPromise = util.promisify(deleteAllToken);
const updatePasswordPromise = util.promisify(updatePassword);

module.exports = {
    createUser: async (req, res) => {
        try {
            let body = req.body;
            // TODO: Check body

            // Check if user with that userid already exists
            const user = await findUserPromise(body.user_id);
            if (user) {
                return res.status(403).json({
                    success: 0,
                    message: "User already exists!"
                });
            }

            // Generate Salt
			const salt = genSaltSync(10);
            // Encrypt Password
			body.password = hashSync(body.password, salt);

            // Insert the user
            const createUser = await createUserPromise(body);
            return res.status(200).json({
                success: 1,
                message: "User Successfully Created!"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: 0,
                message: error.message
            })
        }
    },
    login: (req, res) => {
        res.status(200).json({
            success: 1,
            data: req.user.data,
            message: req.user.message
        });
    },
    updatePassword: async (req, res) => {
        try {
            if (!req.user.user_id) {
                return res.status(500).json({
                    success: 0,
                    message: req.user.message
                });
            }

            // Check Old password
            const validate = compareSync(req.body.old_password, req.user.password);
            if (!validate) {
                return res.status(500).json({
                    success: 0,
                    message: "Invalid Old Password"
                })
            }

            // Delete All tokens from database for this user
            const result = await deleteAllTokenPromise(req.user.user_id);


            // Generate Salt
			const salt = genSaltSync(10);
            // Encrypt Password
			const newPassword = hashSync(req.body.new_password, salt);

            // Update Password
            const updateResult = updatePasswordPromise(req.user.user_id, newPassword);

            return res.status(200).json({
                success: 1,
                message: "Password Successfully Updated (Note: All the previous tokens are now invalid)"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: 0,
                message: error.message
            })
        }
    },
    logout: async (req, res) => {
        try {
            if (req.user.user_id) {
                token = req.get('authorization');
                token = token.slice(7);
                const result = await deleteTokenPromise(req.user.user_id, token);
                return res.status(200).json({
                    success: 1,
                    message: "You have successfully logged out (Note: Only this token is invalid, to invalidate all tokens please update password)"
                });
            }

            return res.status(200).json({
                success: 1,
                data: req.user.user_id,
                message: req.user.message
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