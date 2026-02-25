/**
 * AI Provider configurations
 * Add new providers here
 */

const AI_PROVIDERS = {
  groq: {
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    defaultModel: "llama-3.1-8b-instant",
    models: [
      "llama-3.1-8b-instant",
      "llama-3.1-70b-versatile",
      "mixtral-8x7b-32768",
    ],
  },
  openai: {
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1/chat/completions",
    defaultModel: "gpt-3.5-turbo",
    models: [
      "gpt-3.5-turbo",
      "gpt-4",
      "gpt-4-turbo",
    ],
  },
  anthropic: {
    name: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1/messages",
    defaultModel: "claude-3-haiku-20240307",
    models: [
      "claude-3-haiku-20240307",
      "claude-3-sonnet-20240229",
      "claude-3-opus-20240229",
    ],
  },
};

module.exports = AI_PROVIDERS;
