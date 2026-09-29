// Middleware to protect routes that require authentication
function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  // If this is an API request, send 401 Unauthorized
  if (req.xhr || req.path.startsWith('/api') || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  // Otherwise redirect directly to login page
  return res.redirect('/login');
}

// Middleware to redirect already-authenticated users away from login/register to dashboard
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = {
  requireAuth,
  redirectIfAuth
};
