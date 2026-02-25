const express = require("express");
const router = express.Router();

const askController = require("./controllers/askController");
const healthController = require("./controllers/healthController");
const documentsController = require("./controllers/documentsController");

// Health check - no rate limit
router.get("/health", healthController.getHealth);

// Documents list - no rate limit
router.get("/documents", documentsController.getDocuments);

// Ask endpoint
router.post("/ask", askController.handleAsk);

module.exports = router;