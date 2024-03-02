const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(
        token,
        process.env.ENV_ACCESS_TOKEN,
        (err, decoded) => {
            if (err) res.sendStatus(403);
            req.auth = { userId: decoded.userId };
            next();
        }
    )
};