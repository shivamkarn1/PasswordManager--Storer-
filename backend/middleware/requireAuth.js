import jwt from 'jsonwebtoken';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    try {
      // Decode the Clerk JWT token (no verification for now, just decode)
      const decoded = jwt.decode(token);

      if (!decoded || !decoded.sub) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      req.user = {
        id: decoded.sub,
        email: decoded.email || decoded.email_addresses?.[0]?.email_address
      };

      next();
    } catch (error) {
      console.error('Token decode error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export default requireAuth;