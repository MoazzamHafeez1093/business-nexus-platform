export default function role(requiredRole) {
  return (req, res, next) => {
    console.log('role middleware: called', req.user);
    if (!req.user || req.user.role !== requiredRole) {
      console.log('role middleware: insufficient role');
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    console.log('role middleware: role ok');
    next();
  };
} 