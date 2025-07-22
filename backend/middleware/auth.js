import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  console.log('auth middleware: called');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('auth middleware: no token');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('auth middleware: token valid', decoded);
    next();
  } catch (err) {
    console.log('auth middleware: token invalid', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
} 