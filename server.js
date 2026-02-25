const app = require("./src/app");
const config = require("./src/config");
const knowledgeService = require("./src/services/knowledgeService");
const logger = require("./src/utils/logger");

// Load knowledge base
async function initialize() {
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
});
