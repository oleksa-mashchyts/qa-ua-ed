const jwt = require('jsonwebtoken');

function roleMiddleware(role) {
  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
      const decoded = jwt.verify(token, 'JWT_SECRET');
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'Access denied. Insufficient rights.' });
      }
      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };
}

module.exports = roleMiddleware;
