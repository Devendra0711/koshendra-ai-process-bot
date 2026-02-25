const knowledgeService = require("../services/knowledgeService");

function getDocuments(req, res) {
  const documents = knowledgeService.getDocuments();
  
  res.json({
    success: true,
    count: documents.length,
    documents: documents.map(doc => ({
      filename: doc.filename,
      keywords: doc.keywords.slice(0, 10),
    })),
  });
}

module.exports = {
  getDocuments,
};