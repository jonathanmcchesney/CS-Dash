import helperUtils from '../utils/HelperUtils';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

let randomColor = require('randomcolor');
let password = null;
let email = null;

// Useful tutorial: https://www.codementor.io/olawalealadeusi896/building-simple-api-with-es6-krn8xx3k6

const Users = {

    async create(req, res) {
        password = req.password;
        email = req.email;
        if (!email || !password) {
            return {'message': 'Missing parameters!'}
        }
        if (!helperUtils.isEmailValid(req.email)) {
            return {'message': 'Email address is not valid!'}
        }
        const hashedPass = helperUtils.passwordHash(password);
        let colour = randomColor();
        try {
            // const {rows} = await database.query(sql, values);
            let api = '/authQ'
            const response = await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    id: uuidv4(),
                    email: email,
                    password: hashedPass,
                    created_date: moment(new Date()),
                    modified_date: moment(new Date()),
                    status: 'student',
                    rounded: Math.round(Math.random()),
                    colour: colour,
                    fgcolour: '#FFFFFF'
                })
            });

            const {rows} = await response.json();

            // const token = helperUtils.tokenGen(rows[0].id);
            // console.log('hello',res);
            // console.log(token);
            // return res.status(201).send({token});
            return {'message': 'user created successfully!'};
        } catch (err) {
            if (err.routine === '_bt_check_unique') {
                return {'message': 'Email address is already registered!'}
            }
            return {'message': err}
        }
    },

    async delete(req, res) {
        // const sql = 'DELETE FROM users WHERE id=$1 returning *';
        // try {
        //     const {rows} =
        //         await database.query(sql, [req.user.id]);
        //     if (!rows[0]) {
        //         return res.status(404).send({'message': 'Username/Email is not found!'});
        //     }
        //     return res.status(204).send({'message': 'The Username has been deleted'});
        // } catch (err) {
        //     return res.status(400).send(err);
        // }
    },

    async verifyUser(req, res) {
        password = req.password;
        email = req.email;
        let status = req.status;
        if (!email) {
            return {'message': 'Missing parameters: Email'}
        }
        if (!password) {
            return {'message': 'Missing parameters: Password'}
        }
        if (!status) {
            return {'message': 'Missing parameters: Status'}
        }
        if (!helperUtils.isEmailValid(email)) {
            return {'message': 'Email address is not valid!'}
        }
        try {
            let api = '/verifyUser/' + email + '/' + status
            const response = await fetch(api);
            const {rows} = await response.json();

            if (!rows[0]) {
                let userMsg = 'Email: ' + email + 'could not be verified!'
                return {'message': userMsg};
            }
            if (!helperUtils.passwordMatch(rows[0].password, password)) {
                return {'message': 'Password is incorrect!'};
            }
            return {
                'message': 'user verified',
                'user': email.substr(0, email.indexOf('@')),
                'email': email,
                'status': rows[0].status
            };
        } catch (err) {
            return (err)
        }
    },

    async doesUserExist(req, res) {
        email = req.email;

        if (!email) {
            return {'message': 'Missing parameters'}
        }
        if (!helperUtils.isEmailValid(email)) {
            return {'message': 'Email address is not valid!'}
        }
        try {
            let api = '/loginQ/'+email
            const response = await fetch(api);
            const {rows} = await response.json();

            if (!rows[0]) {
                return {'message': 'user does not exist'};
            }

            return {
                'message': 'user already exists!',
            };
        } catch (err) {
            return (err)
        }
    },

    async login(req, res) {
            password = req.password;
            email = req.email;

        if (!email || !password) {
                return {'message': 'Missing parameters'}
            }
            if (!helperUtils.isEmailValid(email)) {
                return {'message': 'Email address is not valid!'}
            }
            try {
                let api = '/loginQ/'+email
                const response = await fetch(api);
                const {rows} = await response.json();

                if (!rows[0]) {
                    return {'message': 'Email is not registered!'};
                }
                if (!helperUtils.passwordMatch(rows[0].password, password)) {
                    return {'message': 'Username or password is incorrect!'};
                }
                const token = helperUtils.tokenGen(rows[0].id);
                return {
                    'message': 'access granted',
                    'user': email.substr(0, email.indexOf('@')),
                    'email': email,
                    'status': rows[0].status,
                    'bgcolour': rows[0].imagecolour,
                    'fgcolour': rows[0].imagefgcolour,
                    'rounded': rows[0].roundimage,
                    'token': token
                };
            } catch (err) {
                return (err)
            }
        },

    async updatePassword(req, res) {
        let newPassword = req.password;
        email = req.email;
        if (!email) {
            return {'message': 'Email is not valid!'}
        }
        if (!newPassword) {
            return {'message': 'Missing parameters: password'}
        }
        if (!helperUtils.isEmailValid(req.email)) {
            return {'message': 'Email address is not valid!'}
        }
        const newHashedPass = helperUtils.passwordHash(newPassword);

        try {
            let api = '/updatePass'
            await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    email: email,
                    password: newHashedPass
                })
            });
            return {'message': 'Password updated successfully!'};
        } catch (err) {

            return {'message': err}
        }
    },

    async updateAdmin(req, res) {
        let status = req.status;
        email = req.email;
        if (!email) {
            return {'message': 'Email is not valid!'}
        }
        if (!status) {
            return {'message': 'Missing parameters: status!'}
        }
        if (!helperUtils.isEmailValid(req.email)) {
            return {'message': 'Email address is not valid!'}
        }

        try {
            let api = '/updateAdmin'
            await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    email: email,
                    status: status
                })
            });
            return {'message': 'status change successful!'};
        } catch (err) {

            return {'message': err}
        }
    },

    async updateProfile(req, res) {
        email = req.email;
        let bgColour = req.bgColour
        let fgColour = req.fgColour
        let rounded = req.rounded

        if (!email) {
            return {'message': 'Email is not valid!'}
        }
        if (!bgColour || !fgColour) {
            return {'message': 'Missing parameters!'}
        }

        try {
            let api = '/updateProfile'
            await fetch(api, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "post",
                body: JSON.stringify({
                    email: email,
                    fgColour: fgColour,
                    bgColour: bgColour,
                    rounded: rounded
                })
            });
            return {
                'message': 'profile updated successfully!',
                'fgColour': fgColour,
                'bgColour': bgColour,
                'rounded': rounded
            };
        } catch (err) {

            return {'message': err}
        }
    }
}

export default Users;
