// This middleware ensure that the user who tried to access have the authorization based on roles
module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val == true);
        if (!result) return res.sendStatus(401);
        next();
    }
};