const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// this middleware verify the jwt of the user to ensure authentication
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) return res.sendStatus(401); // ?.startWith('Bearer ')
        const token = authHeader.split(' ')[1];
        jwt.verify(
            token,
            process.env.ENV_ACCESS_TOKEN,
            (err, decoded) => {
                if (err) res.sendStatus(403);
                req.auth = decoded.UserInfo.userId;
                req.roles = decoded.UserInfo.roles;
                next();
            }
        )
    } catch {
        () => res.sendStatus(401);
    }
}; 