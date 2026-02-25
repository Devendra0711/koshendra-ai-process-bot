const knowledgeService = require("../services/knowledgeService");
const aiService = require("../services/aiService");

function getHealth(req, res) {
  console.log("[healthController] getHealth called");

  res.json({
    status: "ok",
    documentsLoaded: knowledgeService.loadKnowledgeBase().length,
    uptime: process.uptime(),
    aiProvider: aiService.getCurrentProvider(),
  });
}

function getDocuments(req, res) {
  const documents = knowledgeService.getDocuments();
  res.json({
    count: documents.length,
    documents: documents.map((doc) => ({
      filename: doc.filename,
      keywordCount: doc.keywords.length,
    })),
  });
}

module.exports = { getHealth, getDocuments };
