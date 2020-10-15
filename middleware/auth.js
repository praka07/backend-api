const jwt = require('jsonwebtoken');

module.exports = function(request, response, next) {
    const token = request.header('token');
    if (!token) {
        return response.status(401).send({ 'message': 'Access denied. No token provided' });
    }
    try {
        const decode = jwt.verify(token, process.env.secret || 'privateKey');
        next();

    } catch (err) {
        response.status(400).send({ 'message': 'invaild token' });


    }
}