const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== 'superAdmin') {
    return res.status(403).json({ message: 'Access denied: Super Admins only' });
  }
  next();
};

export default superAdminMiddleware;
