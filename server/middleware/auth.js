require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({response:"Niezalogowany"});
        const result = jwt.verify(token, process.env.JWT_SECRET);

        req.user = result;
        next();
    } catch (err) {
        return res.status(401).json({response:"Niezalogowany"});
    }
}

module.exports = auth;
