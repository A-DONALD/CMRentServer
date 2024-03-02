const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
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
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
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
                    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.status(200).json({ userId: user._id, accesToken });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllUser = (req, res, next) => {
    User.find()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(400).json({ error }));
}