const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const token = req.header('x-auth-token');

  
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
   
    req.user = { 
      id: decoded.userId 
    };
    
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
}; 