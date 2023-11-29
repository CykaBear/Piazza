const jsonwebtoken = require('jsonwebtoken');

function auth(req, res, next) {
    let token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ message: 'Access denied' }); //Deny invalid tokens
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    try {
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET); // If user token is verified then add it to the request.user value
        req.user = verified; 
        next(); 
    } catch (err) {
        return res.status(401).send({ message: 'Token is invalid' });
    }
}

module.exports = auth;