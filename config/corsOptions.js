// Cross Origin Resource Sharing
const whitelist = [
    'https://a-donald.vercel.app',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3500'
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not Allowed by CORS'))
        }
    },
    optionSuccesStatus: 200
}

module.exports = corsOptions;