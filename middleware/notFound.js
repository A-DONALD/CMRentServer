const path = require('path');

const notFound = (req, res) => {
    // res.redirect(301, '/index');
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, '..', 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: "404 Not Found" })
    } else {
        res.type('txt').send("404 Not Found")
    }
}

module.exports = notFound;