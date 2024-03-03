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
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(() => res.sendStatus(400));
        })
        .catch(() => res.sendStatus(500));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.sendStatus(401);
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        logEvents(`${req.body.email}\tinvalid`, 'accountLog.txt');
                        return res.sendStatus(401);
                    }
                    const accesToken = jwt.sign(
                        { userId: user._id },
                        process.env.ENV_ACCESS_TOKEN,
                        { expiresIn: '30s' }
                    );
                    const refreshToken = jwt.sign(
                        { userId: user._id },
                        process.env.ENV_REFRESH_TOKEN,
                        { expiresIn: '24h' }
                    );
                    User.updateOne({ _id: user._id }, { token: refreshToken })
                        .then(console.log('token saved'))
                        .catch(() => res.sendStatus(500));
                    logEvents(`${req.body.email}\tvalid`, 'accountLog.txt');
                    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.status(200).json({ accesToken });
                })
                .catch(() => res.sendStatus(500));
        })
        .catch(() => res.sendStatus(500));
};

exports.getAllUser = (req, res, next) => {
    User.find()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
}