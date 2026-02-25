const aiService = require("../services/aiService");
const knowledgeService = require("../services/knowledgeService");
const logger = require("../utils/logger");

async function handleAsk(req, res) {
  const startTime = Date.now();
  const { question } = req.body;

  try {
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    logger.log(`\n📝 Question received: "${question}"`);

    // Search knowledge base
    const relevantDocs = knowledgeService.searchKnowledge(question);
    logger.log(`📚 Found ${relevantDocs.length} relevant documents`);

    // Get AI response - use askAI instead of getAnswer
    const answer = await aiService.askAI(question);
    const duration = Date.now() - startTime;

    logger.log(`✅ Answer generated in ${duration}ms\n`);

    res.json({
      answer,
      meta: {
        durationMs: duration,
        documentsSearched: relevantDocs.length,
      },
    });
  } catch (error) {
    logger.logError(error, { question });

    res.status(500).json({
      error: error.message || "Failed to process question",
    });
  }
}

module.exports = {
  handleAsk,
};