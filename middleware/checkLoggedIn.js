const checkLoggedIn = (req, res, next) => {
    if(!req.session.user) {
        res.json({notification: {title: "session expired", type: "error"}})
    }
    else {
        next()
    }
}

module.exports = {checkLoggedIn}