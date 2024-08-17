const jwt = require('jsonwebtoken');
const { apiKey, jwtKey } = require('./constants.js');

// middleware for api validation
const validateApiKey = (req, res, next) => {
    const requestApiKey = req.headers['x-api-key'];
    if (!requestApiKey || requestApiKey !== apiKey) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}
  
// middleware for token validation
const validateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if(!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    jwt.verify(token, jwtKey, (err, decoded) => {
        if(err) {
        return res.status(403).json({ error: 'Invalid token' });
        }
        next();
    });
}
  
// middleware for authorization
const authorizeAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    let { groupId } = req.body;

    if (!groupId) {
        groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({ error: 'GroupId is required' });
        }
    }

    jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const group = decoded.groups.find((group) => group.groupId == groupId);

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (group.roleId !== 1 && group.roleId !== 0) {
            return res.status(403).json({ error: 'Access denied' });
        }

        next();
    });
}

module.exports = {
    validateApiKey: validateApiKey,
    validateToken: validateToken,
    authorizeAdmin: authorizeAdmin
}