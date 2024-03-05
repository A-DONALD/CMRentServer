const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logEvents');
const auth = require('./middleware/authentication');
const PORT = process.env.PORT || 3500;
dotenv.config();

mongoose.connect(process.env.ENV_DEV_MONGO)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Save the log request
app.use(logger);

// check if credentials is needed and fetch cookies credentials requirement
app.use(credentials);

// use cors options to allow origin
app.use(cors(corsOptions));

// Middleware to handle url encoded data like forms
app.use(express.urlencoded({ extended: false }));

// Middleware for json data
app.use(express.json());

// Middleware for Cookies
app.use(cookieParser());

// server static files directory
app.use(express.static(path.join(__dirname, '/public')));

// Serve the root directory
app.use('/', require('./routes/root'));
// Serve the authenticator route
app.use('/api/auth', require('./routes/user'));
app.use('/api/auth', require('./routes/refresh'))
app.use('/api/auth', require('./routes/logout'));

// authentication
app.use(auth);

// Serve the route who need authentication
app.use('/api/thing', require('./routes/app'));

// defaut route
app.all('*', notFound);

// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listenning on port ${PORT}`));