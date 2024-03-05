const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { logEvents } = require('../middleware/logEvents');
dotenv.config();

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                roles: { "User": 2001 },
                token: ''
            });
            user.save()
                .then(() => res.sendStatus(201))
                .catch(() => { return res.sendStatus(400) });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    //find user who have the same email
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.sendStatus(401); // no user: Unauthorized
            }
            // compare the password hash
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        logEvents(`${req.body.email}\tdenied`, 'accountLog.txt');
                        return res.sendStatus(401); // wrong password: Unauthorized
                    }
                    const roles = Object.values(user.roles);
                    console.log(roles);
                    const accesToken = jwt.sign(
                        {
                            "UserInfo": {
                                "userId": user._id,
                                "roles": roles
                            }
                        },
                        process.env.ENV_ACCESS_TOKEN,
                        { expiresIn: '30s' }
                    );
                    const refreshToken = jwt.sign(
                        { userId: user._id },
                        process.env.ENV_REFRESH_TOKEN,
                        { expiresIn: '24h' }
                    );
                    // save the refresh token in the db
                    User.updateOne({ _id: user._id }, { token: refreshToken })
                        .then(console.log('token saved'))
                        .catch(error => res.status(500).json({ error }));
                    logEvents(`${req.body.email}\tlogin`, 'accountLog.txt');
                    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.status(200).json({ accesToken });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.logout = (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;
    User.findOne({ token: refreshToken })
        .then(user => {
            if (!user) {
                res.clearCookie('jwt', { httpOnly: true });
                return res.sendStatus(204);
            }
            // Delete the refresh token in db
            User.updateOne({ _id: user._id }, { token: '' })
                .then(logEvents(`${user.email}\tlogout`, 'accountLog.txt'))
                .catch(error => res.status(500).json({ error }));
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true }); // secure: true for https only
            res.sendStatus(204);
        })
        .catch(error => res.status(500).json({ error }));
};