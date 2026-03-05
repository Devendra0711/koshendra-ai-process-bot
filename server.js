const app = require("./src/app");
const config = require("./src/config");
const knowledgeService = require("./src/services/knowledgeService");
const connectDB = require("./src/config/database");
const logger = require("./src/utils/logger");

// Load knowledge base and connect DB
async function initialize() {
  await connectDB();
  await knowledgeService.loadKnowledgeBase();
}

// Initialize and start server
initialize().then(() => {
  app.listen(config.port, () => {
    console.log(`
🚀 AI Process Bot Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Port: ${config.port}
🌍 Environment: ${config.nodeEnv}
🤖 AI Provider: ${config.ai.provider}
✅ MongoDB: Connected
📚 Documents: ${knowledgeService.loadKnowledgeBase().length} loaded
🔒 Rate Limit: ${config.rateLimit.maxRequests} requests per minute
📝 Logs: ${logger.LOG_DIR}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

API Endpoints:
  POST /api/ask        - Ask a question
  GET  /api/health     - Health check
  GET  /api/documents  - List documents
    `);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
