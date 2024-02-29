const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { logger } = require('./middleware/logEvents');
const PORT = process.env.PORT || 3500;

// Save the log request
app.use(logger);
// Cross Origin Resource Sharing
const whitelist = ['https://a-donald.vercel.app', 'http://127.0.0.1:5173', 'http://127.0.0.1:3500'];
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
app.use(cors(corsOptions));

// Middleware to handle url encoded data like forms
app.use(express.urlencoded({ extended: false }));
// Middleware for json data
app.use(express.json());
// server static files directory
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname });
})
// defaut route
app.all('*', notFound)
// error handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server listenning on port ${PORT}`));