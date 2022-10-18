const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if(err) return res.sendStatus(403);
    req.user = user;
    next()
  })
}

module.exports = {auth}