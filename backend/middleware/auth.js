import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// Optional authentication middleware
// This allows both authenticated and unauthenticated access
// but sets req.user if token is valid
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return next();
  }
  
  jwt.verify(token, SECRET, (err, user) => {
    if (!err) {
      req.user = user;
    }
    next();
  });
};

export { authenticateToken, optionalAuth }; 