const allowedsOrigins = require('./allowedsOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedsOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS'))
        }
    },
    optionSuccesStatus: 200
}

module.exports = corsOptions;