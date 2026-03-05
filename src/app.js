const express = require("express");
const cors = require("cors");
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

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.path}`);
  next();
});

// Health check at root level for render 
app.get("/health", (re, res) => {
  res.json({status: "ok"})
});

// Auth routes
app.use('/api/auth', authRoutes);

// Chat routes
app.use('/api/chats', chatRoutes);

// API routes
app.use("/api", routes);


module.exports = app;
