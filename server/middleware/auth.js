// middleware/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload; // contains { id, role }
    next();
  });
}

function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== requiredRole) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
