const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { logger } = require('./middleware/logEvents');
const PORT = process.env.PORT || 3500;
dotenv.config();

mongoose.connect(process.env.ENV_DEV_MONGO)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Save the log request
app.use(logger);
// use cors options to allow origin
app.use(cors(corsOptions));
// Middleware to handle url encoded data like forms
app.use(express.urlencoded({ extended: false }));
// Middleware for json data
app.use(express.json());
// server static files directory
app.use(express.static(path.join(__dirname, '/public')));
// Serve the root directory
app.use('/', require('./routes/root'));
// Serve the authenticator
app.use('/api/auth', require('./routes/user'));
// defaut route
app.all('*', notFound);
// error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listenning on port ${PORT}`));