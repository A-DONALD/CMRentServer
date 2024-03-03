const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const handleRefreshToken = (req, res, next) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    User.findOne({ token: refreshToken })
        .then(user => {
            if (!user) return res.sendStatus(403); // forbiden
            jwt.verify(
                refreshToken,
                process.env.ENV_REFRESH_TOKEN,
                (err, decoded) => {
                    if (err || (user._id != decoded.userId)) {
                        return res.sendStatus(403);
                    }
                    const accesToken = jwt.sign(
                        { userId: user._id },
                        process.env.ENV_ACCESS_TOKEN,
                        { expiresIn: '30s' }
                    );
                    res.status(200).json({ accesToken });
                }
            )
        })
        .catch(() => res.sendStatus(500));
};

module.exports = { handleRefreshToken };