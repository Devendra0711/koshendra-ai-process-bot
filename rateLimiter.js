const config = require("../config");

const rateLimitMap = new Map();

function rateLimiter(req, res, next) {
  const clientIP = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();
  const userRequests = rateLimitMap.get(clientIP) || [];

  // Filter requests within the window
  const recentRequests = userRequests.filter(
    (time) => now - time < config.rateLimit.windowMs
  );

  if (recentRequests.length >= config.rateLimit.maxRequests) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please wait a moment before trying again.",
      retryAfter: config.rateLimit.windowMs / 1000,
    });
  }

  recentRequests.push(now);
  rateLimitMap.set(clientIP, recentRequests);
  next();
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of rateLimitMap.entries()) {
    const recent = requests.filter(
      (time) => now - time < config.rateLimit.windowMs
    );
    if (recent.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recent);
    }
  }
}, 60000);

module.exports = rateLimiter;
