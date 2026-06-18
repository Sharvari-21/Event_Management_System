const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/**
 * Pulls the Bearer token out of the Authorization header, if present.
 */
const getTokenFromHeader = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }
  return null;
};

/**
 * Requires a valid JWT. Attaches the authenticated user (without password)
 * to req.user, or responds with 401 if missing/invalid/expired.
 */
const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed or expired");
  }
});

/**
 * Identifies the user if a valid token is provided, but does NOT fail
 * the request when the token is missing or invalid. Used on public
 * routes (like the events list) that show extra info to logged-in users.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeader(req);

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) req.user = user;
  } catch (error) {
    // Invalid/expired token on a public route is fine - just treat as a guest
  }

  next();
});

/**
 * Restricts a route to specific roles. Must be used after `protect`.
 * Usage: authorize("admin")
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, no user attached to request");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not permitted to perform this action`
      );
    }

    next();
  };
};

module.exports = { protect, optionalAuth, authorize };