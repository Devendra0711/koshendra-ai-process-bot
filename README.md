# AI Process Bot 🤖

An intelligent internal knowledge-based Q&A assistant with a Vue frontend and multi-provider AI support.

## Features

- ✅ **Vue 3 Web UI** - Modern, responsive chat interface
- ✅ **Multi-Provider AI** - Supports Groq, OpenAI, Anthropic
- ✅ **Semantic Search** - Finds relevant documents based on your question
- ✅ **Rate Limiting** - Configurable requests per minute
- ✅ **Input Validation** - Validates all user inputs
- ✅ **Query Logging** - Tracks all questions and responses
- ✅ **Clean Architecture** - Well-organized folder structure

## Project Structure

```
ai-process-bot/
├── src/
│   ├── config/
│   │   ├── index.js          # Main configuration
│   │   └── aiProviders.js    # AI provider definitions
│   ├── controllers/
│   │   ├── askController.js  # Handle /ask requests
│   │   └── healthController.js
│   ├── middleware/
│   │   ├── index.js
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── validator.js      # Input validation
│   ├── services/
│   │   ├── aiService.js      # AI provider integration
│   │   └── knowledgeService.js
│   ├── utils/
│   │   ├── logger.js         # Logging utility
│   │   └── keywords.js       # Keyword extraction
│   ├── routes/
│   │   └── index.js          # API routes
│   └── app.js                # Express app setup
├── client/                   # Vue 3 frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppHeader.vue
│   │   │   ├── WelcomeScreen.vue
│   │   │   ├── MessageList.vue
│   │   │   └── ChatInput.vue
│   │   ├── assets/
│   │   │   └── styles.css
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── knowledge/                # Markdown knowledge files
├── logs/                     # Query logs (auto-created)
├── server.js                 # Entry point
├── package.json
├── .env                      # Configuration (create from .env.example)
└── .env.example
```

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings
```

**Key settings in `.env`:**

```env
# Choose your AI provider: groq, openai, or anthropic
AI_PROVIDER=groq

# Add your API key
GROQ_API_KEY=your_key_here
```

### 3. Build & Run

```bash
# Build Vue frontend
cd client && npm run build && cd ..

# Start server
node server.js
```

Open http://localhost:3000

### Development Mode

```bash
# Terminal 1: Start backend
node server.js

# Terminal 2: Start Vue dev server
cd client && npm run dev
```

Open http://localhost:5173

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ask` | POST | Ask a question |
| `/api/health` | GET | Server health & AI provider info |
| `/api/documents` | GET | List loaded knowledge documents |

### Example Request

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What happens when an order is created?"}'
```

### Example Response

```json
{
  "success": true,
  "answer": "When an order is created...",
  "meta": {
    "durationMs": 1234,
    "documentsSearched": 3
  }
}
```

## Switching AI Providers

Edit `.env` to switch providers:

```env
# For Groq (default)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key
AI_MODEL=llama-3.1-8b-instant

# For OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-3.5-turbo

# For Anthropic
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_key
AI_MODEL=claude-3-haiku-20240307
```

## Adding Knowledge

Add `.md` or `.txt` files to the `knowledge/` folder. The server loads them on startup.

## Logs

Query logs are stored in `logs/queries.log` and `logs/errors.log`.
