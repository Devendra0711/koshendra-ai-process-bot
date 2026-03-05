const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:7025', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Debug - test route BEFORE other routes
app.get("/test", (req, res) => {
  const docs = knowledgeService.loadKnowledgeBase();
    res.json({ count: docs.length });
});

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  next();
});

// Auth routes
app.use('/api/auth', authRoutes);

// Chat routes
app.use('/api/chats', chatRoutes);

// API routes
app.use("/api", routes);

// Serve Vue frontend (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  
  // SPA fallback — serve index.html for any non-API route
  app.get("/{*splat}", (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    }
  });
}

module.exports = app;
