export const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  