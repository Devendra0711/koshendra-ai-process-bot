require("dotenv").config();

module.exports = {
  // Server
  port: process.env.PORT || 7000,
  nodeEnv: process.env.NODE_ENV || "development",

  // AI Provider
  ai: {
    provider: process.env.AI_PROVIDER || "groq",
    model: process.env.AI_MODEL || "llama-3.1-8b-instant",
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.3,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 1024,
    timeout: parseInt(process.env.AI_TIMEOUT) || 30000,
  },

  // API Keys
  apiKeys: {
    groq: process.env.GROQ_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 20,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || "info",
};
