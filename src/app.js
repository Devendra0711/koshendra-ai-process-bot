const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
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
  
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
  });
}

module.exports = app;
