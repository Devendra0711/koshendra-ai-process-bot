const axios = require("axios");
const config = require("../config");
const AI_PROVIDERS = require("../config/aiProviders");
const knowledgeService = require("./knowledgeService");
const logger = require("../utils/logger");

function getSystemPrompt(contextKnowledge) {
  return `You are an intelligent internal process assistant for a company. Your role is to help employees understand business processes, workflows, and procedures.

INSTRUCTIONS:
- Answer questions ONLY based on the provided knowledge base below
- If the answer is not found in the knowledge base, say "I don't have information about that in my knowledge base"
- Be concise, professional, and helpful
- Use bullet points or numbered steps when explaining processes
- If a question is unclear, ask for clarification
- Highlight important warnings or notes when relevant

KNOWLEDGE BASE:
${contextKnowledge}`;
}

async function askGroq(question, contextKnowledge, apiKey) {
  const provider = AI_PROVIDERS.groq;
  
  try {
    const response = await axios.post(
      provider.baseUrl,
      {
        model: config.ai.model || provider.defaultModel,
        messages: [
          { role: "system", content: getSystemPrompt(contextKnowledge) },
          { role: "user", content: question },
        ],
        temperature: config.ai.temperature,
        max_tokens: config.ai.maxTokens,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: config.ai.timeout,
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      logger.logError(error, { 
        context: "Groq API", 
        status: error.response.status,
        data: error.response.data 
      });
      throw new Error(`Groq API Error: ${error.response.data?.error?.message || error.response.statusText}`);
    }
    throw error;
  }
}

async function askOpenAI(question, contextKnowledge, apiKey) {
  const provider = AI_PROVIDERS.openai;
  
  const response = await axios.post(
    provider.baseUrl,
    {
      model: config.ai.model || provider.defaultModel,
      messages: [
        { role: "system", content: getSystemPrompt(contextKnowledge) },
        { role: "user", content: question },
      ],
      temperature: config.ai.temperature,
      max_tokens: config.ai.maxTokens,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: config.ai.timeout,
    }
  );

  return response.data.choices[0].message.content;
}

async function askAnthropic(question, contextKnowledge, apiKey) {
  const provider = AI_PROVIDERS.anthropic;
  
  const response = await axios.post(
    provider.baseUrl,
    {
      model: config.ai.model || provider.defaultModel,
      max_tokens: config.ai.maxTokens,
      system: getSystemPrompt(contextKnowledge),
      messages: [{ role: "user", content: question }],
    },
    {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      timeout: config.ai.timeout,
    }
  );

  return response.data.content[0].text;
}

async function askAI(question) {
  // Get relevant documents using searchKnowledge
  const relevantDocs = knowledgeService.searchKnowledge(question);
  
  // Build context from relevant docs
  const contextKnowledge = relevantDocs
    .map((doc) => {
      return `--- ${doc.name} (relevance: ${doc.score}) ---\n${doc.content}`;
    })
    .join("\n\n");

  const provider = config.ai.provider;
  const apiKey = config.apiKeys[provider];

  if (!apiKey) {
    throw new Error(`API key not configured for provider: ${provider}`);
  }

  logger.info(`Using AI provider: ${provider}`);

  switch (provider) {
    case "groq":
      return await askGroq(question, contextKnowledge, apiKey);
    case "openai":
      return await askOpenAI(question, contextKnowledge, apiKey);
    case "anthropic":
      return await askAnthropic(question, contextKnowledge, apiKey);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

function getCurrentProvider() {
  return {
    provider: config.ai.provider,
    model: config.ai.model,
    available: AI_PROVIDERS,
  };
}

module.exports = {
  askAI,
  getCurrentProvider,
};