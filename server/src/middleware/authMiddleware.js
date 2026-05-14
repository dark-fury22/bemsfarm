const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    // 1. Get token from header
    // Frontend will send: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Please login.' 
      });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to request
    req.user = decoded; // { id, email }

    // 5. Continue to the next function
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ message: 'Invalid token. Please login.' });
  }
};

module.exports = { protect };