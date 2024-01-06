module.exports = (defaultTitle) => (req, res, next) => {
    res.locals.hasUser  = req.user != undefined;
    next();
};
