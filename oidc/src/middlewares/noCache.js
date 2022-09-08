exports.noCache = (req, res, next) => {
    res.set('cache-control', 'no-store');
    next();
}