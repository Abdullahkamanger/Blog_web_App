import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer TOKEN"

  if (!token) return res.status(403).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This contains { id, role, status }
    next();
  } catch (err) {
    console.error("JWT Verify Error:", err.message, "Token received:", token);
    return res.status(401).json({ message: "Unauthorized!", error: err.message });
  }
};

// Only allow Admins
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: "Require Admin Role!" });
  }
  next();
};

// Only allow Approved Authors or Admins
export const isAuthor = (req, res, next) => {
  if ((req.user.role === 'AUTHOR' && req.user.status === 'APPROVED') || req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Author account pending or restricted." });
  }
};
