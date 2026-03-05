# AI Process Bot 🤖

An intelligent, self-hosted internal knowledge-base Q&A assistant that lets teams ask natural-language questions about internal processes, systems, and workflows — and get accurate, context-aware answers powered by LLMs. Built with a Vue 3 chat interface and a Node.js/Express backend supporting multiple AI providers.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [How It Works — Data Flow](#how-it-works--data-flow)
- [Features](#features)
- [Project Structure](#project-structure)
- [Backend Deep Dive](#backend-deep-dive)
- [Frontend Deep Dive](#frontend-deep-dive)
- [API Reference](#api-reference)
- [AI Provider System](#ai-provider-system)
- [Knowledge Base System](#knowledge-base-system)
- [Middleware & Security](#middleware--security)
- [Logging & Observability](#logging--observability)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [Development Mode](#development-mode)

---

## Overview

**Problem:** In complex multi-product organizations, tribal knowledge lives in scattered docs, Slack threads, and people's heads. New team members and even veterans waste hours finding answers to process-related questions.

**Solution:** AI Process Bot ingests your internal documentation (Markdown/text files), and when a user asks a question through the chat UI, it:

1. Extracts keywords from the question
2. Searches across all loaded knowledge documents for relevant context
3. Sends the question + matched context to an LLM (Groq/OpenAI/Anthropic)
4. Returns a clear, grounded answer — not hallucinated, but based on **your** docs

This makes it a **Retrieval-Augmented Generation (RAG)** system tailored for internal knowledge.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Vue 3 Frontend                           │
│                                                                  │
│  ┌────────────┐  ┌───────────┐  ┌─────────────────────────────┐  │
│  │ AuthModal  │  │ AppHeader │  │        Main Content         │  │
│  │ (JWT login │  └───────────┘  │                             │  │
│  │  register) │                 │  ┌─────────┐ ┌───────────┐  │  │
│  └────────────┘  ┌───────────┐  │  │Welcome  │ │ChatScreen │  │  │
│                  │ Sidebar   │  │  │Screen   │ │ ┌────────┐│  │  │
│  ┌────────────┐  │ • chat    │  │  │ • prods │ │ │MsgList ││  │  │
│  │  Stores    │  │   history │  │  │ • sugge-│ │ │        ││  │  │
│  │ • authStore│  │ • new chat│  │  │   stions│ │ ├────────┤│  │  │
│  │ • chatStore│  │ • rename  │  │  └─────────┘ │ │ChatInpt││  │  │
│  └────────────┘  │ • delete  │  │              │ └────────┘│  │  │
│                  └───────────┘  │  ┌─────────────────────┐ │  │  │
│  ┌────────────┐                 │  │ Products            │ │  │  │
│  │Composables │                 │  │ • product-list      │ │  │  │
│  │ • useChat  │                 │  │ • product-detail    │ │  │  │
│  └────────────┘                 │  └─────────────────────┘ │  │  │
│                                 └─────────────────────────────┘  │
└──────────────────────┬───────────────────────────────────────────┘
                       │ POST /api/ask, /api/auth/*, /api/chats/*
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Express.js Backend                          │
│                                                                  │
│  ┌─────────────┐   ┌──────────────┐   ┌────────────────────┐    │
│  │  Middleware  │──▶│ Controllers  │──▶│     Services       │    │
│  │ • Rate Limit│   │ • ask        │   │ • knowledgeService │    │
│  │ • Validator │   │ • health     │   │ • aiService        │    │
│  │ • Auth (JWT)│   │ • auth       │   └────────┬───────────┘    │
│  └─────────────┘   │ • chats     │            │                │
│                    └──────────────┘            │                │
│  ┌──────────────┐   ┌──────────────────────┐  │                │
│  │    Logger     │   │  Knowledge Files    │  │                │
│  │ queries.log  │   │  /knowledge/*.md    │◀─┘                │
│  │ errors.log   │   └──────────────────────┘                   │
│  └──────────────┘   ┌──────────────────────┐                   │
│                     │  MongoDB             │                   │
│                     │ • users, chats, msgs │                   │
│                     └──────────────────────┘                   │
└──────────────────────┬─────────────────────────────────────────┘
                       │ API Call
                       ▼
             ┌──────────────────────┐
             │   AI Provider (LLM)  │
             │  • Groq (Llama 3.1)  │
             │  • OpenAI (GPT)      │
             │  • Anthropic (Claude)│
             └──────────────────────┘
```

---

## How It Works — Data Flow

### On Server Startup

1. **Knowledge Loading** — `knowledgeService.js` scans the `knowledge/` directory and reads all `.md` and `.txt` files into memory
2. Each document is stored as an object with its filename (as title) and full content
3. **AI Provider Initialization** — `aiService.js` reads the configured provider from `.env` and sets up the API client (Groq, OpenAI, or Anthropic)
4. **Express App Boot** — Middleware stack is mounted (rate limiter, validator, CORS, static file serving), routes are registered, and the server starts listening

### On User Question (Runtime)

```
User types question
       │
       ▼
[1] ChatInput.vue captures input, emits to App.vue
       │
       ▼
[2] App.vue sends POST /api/ask { question } to backend
       │
       ▼
[3] Rate Limiter checks if user has exceeded requests/min
       │  (rejects with 429 if exceeded)
       ▼
[4] Validator checks question is non-empty, within max length
       │  (rejects with 400 if invalid)
       ▼
[5] askController receives validated request
       │
       ▼
[6] knowledgeService.search(question)
       │  • keywords.js extracts key terms from the question
       │  • Scores each knowledge document by keyword match frequency
       │  • Returns top-N most relevant document chunks
       │
       ▼
[7] aiService.ask(question, relevantContext)
       │  • Constructs a system prompt: "You are an internal process assistant.
       │    Answer based ONLY on the provided context."
       │  • Sends system prompt + context + user question to the configured LLM
       │  • Receives generated answer
       │
       ▼
[8] Logger records: question, answer, duration, documents matched
       │
       ▼
[9] Response sent back: { success, answer, meta: { durationMs, documentsSearched } }
       │
       ▼
[10] App.vue receives response, pushes bot message to MessageList
        │
        ▼
[11] MessageList.vue renders the answer with formatting
```

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Natural Language Q&A** | Ask questions in plain English about any internal process, system, or workflow |
| **RAG (Retrieval-Augmented Generation)** | Answers are grounded in your actual documentation — not hallucinated |
| **Multi-Provider AI** | Swap between Groq (Llama 3.1), OpenAI (GPT), or Anthropic (Claude) with a single env var |
| **Keyword-Based Document Search** | Extracts meaningful keywords from questions, scores and ranks knowledge docs by relevance |
| **Real-time Chat UI** | Vue 3 chat interface with typing indicators, message history, and responsive design |
| **Knowledge Hot-Loading** | Drop `.md` or `.txt` files into `knowledge/` — server loads them on startup |

### Security & Reliability

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | User login/register with JWT tokens and bcrypt password hashing |
| **Chat History Persistence** | Per-user chat sessions stored in MongoDB — create, rename, delete, switch between chats |
| **Rate Limiting** | Configurable requests-per-minute per IP to prevent abuse |
| **Input Validation** | Sanitizes and validates all user input (empty check, max length, character filtering) |
| **Error Handling** | Graceful error responses with proper HTTP status codes; errors never leak internals |
| **CORS Configuration** | Configurable cross-origin policies for dev and production |

### Observability

| Feature | Description |
|---------|-------------|
| **Query Logging** | Every question, response, duration, and matched documents logged to `logs/queries.log` |
| **Error Logging** | All errors captured with stack traces in `logs/errors.log` |
| **Health Endpoint** | `/api/health` returns server status, active AI provider, model, and loaded document count |
| **Response Metadata** | Every answer includes `durationMs` and `documentsSearched` for performance tracking |

---

## Project Structure

```
ai-process-bot/
│
├── server.js                      # Entry point — starts Express server
│
├── src/
│   ├── app.js                     # Express app setup (middleware, routes, static serving)
│   │
│   ├── config/
│   │   ├── index.js               # Centralized config (port, rate limits, AI settings from .env)
│   │   └── aiProviders.js         # Provider definitions (endpoints, headers, request formats)
│   │
│   ├── controllers/
│   │   ├── askController.js       # Handles POST /api/ask — orchestrates search + AI call
│   │   └── healthController.js    # Handles GET /api/health — returns server/provider status
│   │
│   ├── middleware/
│   │   ├── index.js               # Middleware barrel export
│   │   ├── rateLimiter.js         # IP-based rate limiting with configurable window/max
│   │   └── validator.js           # Request body validation (question field)
│   │
│   ├── services/
│   │   ├── aiService.js           # AI provider abstraction — prompt construction, API calls
│   │   └── knowledgeService.js    # Document loading, keyword search, relevance scoring
│   │
│   ├── utils/
│   │   ├── logger.js              # File-based logging (queries + errors with timestamps)
│   │   └── keywords.js            # Keyword extraction from natural language questions
│   │
│   └── routes/
│       └── index.js               # Route definitions (/api/ask, /api/health, /api/documents)
│
├── client/                        # Vue 3 Frontend (Vite)
│   ├── src/
│   │   ├── main.js                # Vue app initialization (creates app, mounts router/pinia)
│   │   ├── App.vue                # Root component — layout shell, auth gate, chat orchestration
│   │   │
│   │   ├── router/
│   │   │   └── index.js           # Vue Router config (routes for chat, products, question view)
│   │   │
│   │   ├── stores/                # Pinia state management
│   │   │   ├── authStore.js       # Auth state (login, register, logout, JWT token, user info)
│   │   │   └── chatStore.js       # Chat history CRUD (fetch, create, select, rename, delete)
│   │   │
│   │   ├── composables/
│   │   │   └── useChat.js         # Chat composable (messages array, sendMessage, clearMessages)
│   │   │
│   │   ├── views/
│   │   │   └── QuestionView.vue   # Product-specific question view (routed via /question/:product)
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── auth-modal.vue         # Login/Register modal template
│   │   │   │   ├── auth-modal.js          # Auth modal logic (form state, login/register calls)
│   │   │   │   └── auth-modal.css         # Auth modal styles (form layout, inputs, buttons)
│   │   │   │
│   │   │   ├── Header/
│   │   │   │   ├── app-header.vue         # Top nav bar template
│   │   │   │   ├── app-header.js          # Header logic (user info, logout, sidebar toggle)
│   │   │   │   └── app-header.css         # Header styles (nav layout, branding, responsive)
│   │   │   │
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.vue            # Sidebar template
│   │   │   │   ├── sidebar.js             # Sidebar logic (chat list, CRUD, active chat tracking)
│   │   │   │   └── sidebar.css            # Sidebar styles (panel layout, chat items, animations)
│   │   │   │
│   │   │   ├── Chat/
│   │   │   │   ├── welcome-screen/
│   │   │   │   │   ├── welcome-screen.vue # Landing view template
│   │   │   │   │   ├── welcome-screen.js  # Welcome logic (suggested questions, product cards)
│   │   │   │   │   └── welcome-screen.css # Welcome styles (cards grid, greeting, suggestions)
│   │   │   │   │
│   │   │   │   └── chat-screen/
│   │   │   │       ├── chat-screen.vue    # Chat screen wrapper template
│   │   │   │       ├── chat-screen.js     # Chat screen logic (props, emits, scroll handling)
│   │   │   │       ├── chat-screen.css    # Chat screen styles (layout, container)
│   │   │   │       │
│   │   │   │       ├── message-list/
│   │   │   │       │   ├── message-list.vue   # Message renderer template
│   │   │   │       │   ├── message-list.js    # Message list logic (auto-scroll, typing indicator)
│   │   │   │       │   └── message-list.css   # Message styles (bubbles, alignment, animations)
│   │   │   │       │
│   │   │   │       └── chat-input/
│   │   │   │           ├── chat-input.vue     # Text input template
│   │   │   │           ├── chat-input.js      # Input logic (auto-resize, keydown, emit send)
│   │   │   │           └── chat-input.css     # Input styles (textarea, send button, disabled state)
│   │   │   │
│   │   │   └── products/
│   │   │       ├── product-list/
│   │   │       │   ├── product-list.vue       # Product listing template
│   │   │       │   ├── product-list.js        # Product list logic (fetch products, navigate)
│   │   │       │   └── product-list.css       # Product list styles (grid layout, cards)
│   │   │       │
│   │   │       └── product-detail/
│   │   │           ├── product-detail.vue     # Product detail template
│   │   │           ├── product-detail.js      # Product detail logic (route params, CTA)
│   │   │           └── product-detail.css     # Product detail styles (layout, modules list)
│   │   │
│   │   └── assets/
│   │       └── styles.css         # Global styles, chat bubbles, sidebar, animations, responsive
│   │
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite config with API proxy for dev mode
│   └── package.json
│
├── knowledge/                     # Knowledge base directory
│   ├── order-process.md           # Example: Order lifecycle documentation
│   ├── dispatch-workflow.md       # Example: Dispatch automation docs
│   └── ...                        # Add any .md or .txt files here
│
├── logs/                          # Auto-created at runtime
│   ├── queries.log                # All Q&A interactions with timestamps
│   └── errors.log                 # Error traces
│
├── .env                           # Environment configuration (create from .env.example)
├── .env.example                   # Template with all configurable variables
└── package.json
```

---

## Backend Deep Dive

### Entry Point (`server.js`)

Bootstraps the application:
- Loads environment variables from `.env`
- Imports the configured Express app from `src/app.js`
- Starts the HTTP server on the configured port
- Logs startup info (port, AI provider, loaded documents count)

### App Setup (`src/app.js`)

Configures the Express application stack:
- **JSON body parsing** with size limits
- **CORS** middleware for cross-origin requests
- **Rate limiter** middleware (applied to `/api/*` routes)
- **Static file serving** for the built Vue frontend (`client/dist`)
- **API route mounting** under `/api`
- **SPA fallback** — serves `index.html` for any non-API route (client-side routing support)

### Configuration (`src/config/`)

**`index.js`** — Single source of truth for all app configuration:
- `port` — Server port (default: 3000)
- `aiProvider` — Active provider name (`groq`, `openai`, `anthropic`)
- `aiModel` — Model identifier for the active provider
- `apiKeys` — Provider API keys from environment
- `rateLimit.windowMs` — Rate limit time window
- `rateLimit.max` — Max requests per window
- `knowledgePath` — Path to knowledge documents directory

**`aiProviders.js`** — Provider registry defining:
- API endpoint URLs for each provider
- Request header formats (auth patterns differ per provider)
- Request body structure (Groq/OpenAI use `messages[]`, Anthropic uses different format)
- Response parsing logic (how to extract the answer from each provider's response shape)

### Controllers (`src/controllers/`)

**`askController.js`** — Core request handler:
1. Receives validated question from request body
2. Calls `knowledgeService.search(question)` to find relevant documents
3. Calls `aiService.ask(question, context)` to get the LLM response
4. Measures total processing duration
5. Logs the interaction via `logger`
6. Returns structured response with answer and metadata

**`healthController.js`** — Diagnostics endpoint:
- Returns server uptime
- Active AI provider and model name
- Number of loaded knowledge documents
- Server timestamp

### Services (`src/services/`)

**`knowledgeService.js`** — Document retrieval engine:

| Method | Purpose |
|--------|---------|
| `loadDocuments()` | Reads all `.md`/`.txt` files from `knowledge/` into memory on startup |
| `search(question)` | Extracts keywords → scores each document by keyword match frequency → returns top-N relevant chunks |
| `getDocumentList()` | Returns list of loaded document names (for `/api/documents`) |

Scoring algorithm:
- Extracts keywords from the question (via `keywords.js`)
- For each document, counts how many keywords appear in the content (case-insensitive)
- Ranks documents by match count descending
- Returns the top-ranked documents' content as context for the LLM

**`aiService.js`** — AI provider abstraction layer:

| Method | Purpose |
|--------|---------|
| `ask(question, context)` | Constructs the prompt, calls the configured LLM API, returns the answer |

Prompt construction:
```
System: You are an internal process knowledge assistant. Answer the user's
question based ONLY on the provided context. If the context doesn't contain
relevant information, say so. Be clear and concise.

Context:
[relevant document excerpts from knowledgeService]

User: [the actual question]
```

Provider abstraction:
- Reads provider config from `aiProviders.js`
- Formats the request body according to the provider's expected schema
- Sends HTTP request to the provider's API endpoint
- Parses the response using provider-specific response extraction logic
- Returns the plain text answer

### Middleware (`src/middleware/`)

**`rateLimiter.js`**:
- Uses an in-memory store keyed by client IP
- Tracks request timestamps within a sliding window
- Returns `429 Too Many Requests` with a `Retry-After` header when exceeded
- Window and max requests configurable via `.env`

**`validator.js`**:
- Validates `question` field exists in request body
- Checks question is a non-empty string
- Enforces maximum question length
- Trims whitespace
- Returns `400 Bad Request` with descriptive error on failure

### Utilities (`src/utils/`)

**`logger.js`**:
- Creates `logs/` directory if it doesn't exist
- `logQuery(question, answer, duration, docsSearched)` — appends to `queries.log`
- `logError(error, context)` — appends to `errors.log` with stack trace
- Each log entry includes ISO timestamp

**`keywords.js`**:
- Tokenizes question into words
- Removes common stop words (the, is, a, an, how, what, etc.)
- Filters out short tokens (< 3 characters)
- Converts to lowercase for case-insensitive matching
- Returns array of meaningful keywords

---

## Frontend Deep Dive

### Tech Stack
- **Vue 3** with Composition API
- **Vite** for dev server and production builds
- **Pinia** for state management
- **Vue Router** for client-side routing
- **Vanilla CSS** — no UI framework dependency

### State Management

**`stores/authStore.js`** — Authentication state:
- `login(email, password)` — sends credentials to `/api/auth/login`, stores JWT token
- `register(name, email, password)` — creates account via `/api/auth/register`
- `logout()` — clears token and user state
- Persists JWT token (used in API request headers)
- Tracks current user info (name, email)

**`stores/chatStore.js`** — Chat history persistence:
- `fetchChats()` — loads all chat sessions for the logged-in user from backend
- `createChat()` — creates a new chat session
- `selectChat(chatId)` — switches active chat, loads its message history
- `renameChat(chatId, title)` — updates chat title
- `deleteChat(chatId)` — removes a chat session
- All operations are persisted to MongoDB via API calls

### Composables

**`composables/useChat.js`** — Real-time chat logic:
- `messages` — reactive array of current chat messages
- `sendMessage(question)` — pushes user message, calls `/api/ask`, pushes bot response
- `clearMessages()` — resets message array (used when switching chats)
- `isLoading` — tracks whether a response is pending (drives typing indicator)
- Handles API errors gracefully — shows error message in chat bubble

### Routing (`router/index.js`)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `App.vue` (with `welcome-screen`) | Landing page with product cards and suggested questions |
| `/question/:product` | `QuestionView.vue` | Product-specific question interface |
| `/products` | `product-list.vue` | Grid of all available products/modules |
| `/products/:id` | `product-detail.vue` | Individual product detail page |

### Component Breakdown

**`App.vue`** — Root component and layout shell:
- Checks auth state on mount — shows `auth-modal` if not logged in
- Renders `app-header` + `sidebar` + main content area
- Orchestrates chat flow between sidebar (chat selection) and chat screen
- Conditionally renders `welcome-screen` (no active chat) or `chat-screen` (active chat)

**`components/auth/auth-modal.vue`** — Authentication modal:
- Toggle between Login and Register forms
- Form validation (email format, password length)
- Calls `authStore.login()` or `authStore.register()`
- Dismisses on successful authentication
- Shows inline error messages on failure

**`components/Header/app-header.vue`** — Top navigation bar:
- App name/branding
- User info display (name/email of logged-in user)
- Logout button — calls `authStore.logout()`
- Hamburger menu toggle for sidebar on mobile

**`components/sidebar/sidebar.vue`** — Left sidebar panel:
- "New Chat" button — creates a new chat session via `chatStore.createChat()`
- Lists all chat sessions for the current user (fetched from `chatStore`)
- Click a chat to switch to it (`chatStore.selectChat()`)
- Inline rename — double-click chat title to edit
- Delete chat — with confirmation
- Highlights the currently active chat
- Collapsible on mobile

**`components/Chat/welcome-screen/welcome-screen.vue`** — Landing state:
- Greeting message explaining what the bot can do
- Product cards — clickable tiles for each covered product/module
- Suggested starter questions (clickable — auto-sends the question)
- Shown when no chat is active or chat has no messages

**`components/Chat/chat-screen/chat-screen.vue`** + **`chat-screen.js`** — Chat screen:
- Layout wrapper for the message list and input area
- `chat-screen.js` contains the extracted `<script setup>` logic:
  - Props: receives current chat ID, messages, loading state
  - Emits: `send` event when user submits a question
  - Auto-scroll handling — scrolls to bottom on new messages
  - Refs for DOM elements (message container, input)

**`components/Chat/chat-screen/message-list/message-list.vue`** — Message renderer:
- Renders user messages (right-aligned, styled differently) and bot messages (left-aligned)
- Shows typing indicator (animated dots) while `isLoading` is true
- Auto-scrolls to the latest message using `scrollIntoView`
- Formats bot responses preserving line breaks, code blocks, and whitespace
- Displays timestamps on each message

**`components/Chat/chat-screen/chat-input/chat-input.vue`** — Input area:
- Auto-resizing `<textarea>` that grows with content
- Send button (disabled while loading or input is empty)
- `Enter` to send, `Shift+Enter` for new line
- Emits `send` event with the trimmed question text
- Clears input after sending
- Focuses input automatically when chat loads

**`components/products/product-list/product-list.vue`** — Product listing:
- Displays a grid of all available products/modules the bot covers
- Each card shows product name, description, and module count
- Click navigates to `product-detail` for that product
- Used for browsing what knowledge domains are available

**`components/products/product-detail/product-detail.vue`** — Product detail:
- Shows detailed info about a specific product/module
- Lists sub-modules or topics covered
- "Ask a Question" CTA — navigates to `QuestionView` scoped to that product
- Back button to return to product list

### Views

**`views/QuestionView.vue`** — Product-scoped question interface:
- Receives `:product` param from route
- Renders a chat interface pre-scoped to a specific product
- Questions are automatically tagged with the product context
- Uses `useChat` composable for message handling

### Vite Configuration (`vite.config.js`)

- **Dev proxy** — Proxies `/api/*` requests to `http://localhost:3000` during development, so the Vue dev server (port 5173) can talk to the Express backend without CORS issues
- **Build output** — Compiles to `client/dist/` which Express serves as static files in production

---

## API Reference

### `POST /api/ask`

Ask a question against the knowledge base.

**Request:**
```json
{
  "question": "What happens when an order is created in the system?"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "answer": "When an order is created, the system first validates the customer configuration, then routes the order through the dispatch automation pipeline...",
  "meta": {
    "durationMs": 1847,
    "documentsSearched": 3
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Question is required and must be a non-empty string"
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 30
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Failed to process your question. Please try again."
}
```

---

### `GET /api/health`

Server health check and diagnostics.

**Response (200):**
```json
{
  "status": "ok",
  "uptime": 3600,
  "provider": "groq",
  "model": "llama-3.1-8b-instant",
  "documentsLoaded": 5,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

### `GET /api/documents`

List all loaded knowledge documents.

**Response (200):**
```json
{
  "success": true,
  "documents": [
    "order-process.md",
    "dispatch-workflow.md",
    "carrier-integration.md"
  ],
  "count": 3
}
```

---

## AI Provider System

The bot supports three AI providers through a unified abstraction layer. Switching providers requires only changing environment variables — no code changes.

### Supported Providers

| Provider | Default Model | Best For | Speed |
|----------|---------------|----------|-------|
| **Groq** | `llama-3.1-8b-instant` | Fast inference, free tier available | ⚡ Fastest |
| **OpenAI** | `gpt-3.5-turbo` | Balanced quality and cost | 🟡 Medium |
| **Anthropic** | `claude-3-haiku-20240307` | Strong reasoning, safety | 🟡 Medium |

### How Provider Abstraction Works

```
aiProviders.js defines:
  ├── groq:     { endpoint, headers, buildBody(), parseResponse() }
  ├── openai:   { endpoint, headers, buildBody(), parseResponse() }
  └── anthropic: { endpoint, headers, buildBody(), parseResponse() }

aiService.js at runtime:
  1. Reads AI_PROVIDER from config
  2. Looks up provider definition from aiProviders.js
  3. Uses that provider's buildBody() to format the request
  4. Sends to that provider's endpoint with correct headers
  5. Uses that provider's parseResponse() to extract the answer
```

### Switching Providers

Edit `.env`:

```env
# Groq (default — fastest, free tier)
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key
AI_MODEL=llama-3.1-8b-instant

# OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
AI_MODEL=gpt-3.5-turbo

# Anthropic
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_key
AI_MODEL=claude-3-haiku-20240307
```

Restart the server after changing providers.

---

## Knowledge Base System

### How It Works

1. **On startup**, the server reads every `.md` and `.txt` file from the `knowledge/` directory
2. Each file is stored in memory as `{ title: filename, content: fileContents }`
3. **On each question**, the keyword search engine:
   - Extracts meaningful keywords from the question (removing stop words)
   - Scans each document's content for keyword matches
   - Scores documents by match frequency
   - Returns the top-ranked documents as context
4. The context is injected into the LLM prompt so the answer is **grounded in your actual docs**

### Adding Knowledge

Drop any `.md` or `.txt` file into the `knowledge/` directory:

```bash
knowledge/
├── order-lifecycle.md          # How orders flow through the system
├── dispatch-automation.md      # Dispatch rules and carrier routing
├── carrier-integration.md      # Carrier API integration details
├── customer-onboarding.md      # Customer setup workflows
└── troubleshooting-guide.txt   # Common issues and fixes
```

**Best practices for knowledge files:**
- Use descriptive filenames (they're used as document titles in logs)
- Use clear headings and bullet points — helps keyword matching
- One topic per file for better relevance scoring
- Include the terminology your team actually uses when asking questions
- Restart the server after adding/modifying knowledge files

---

## Middleware & Security

### Rate Limiting

Prevents abuse and controls API usage:

```
Client IP → Rate Limiter → [Allow / 429 Reject]
```

- **Window-based** — tracks requests per IP within a sliding time window
- **Configurable** via `.env`:
  ```env
  RATE_LIMIT_WINDOW_MS=60000    # 1 minute window
  RATE_LIMIT_MAX=20             # Max 20 requests per window
  ```
- Returns `429 Too Many Requests` with `Retry-After` header
- In-memory store (resets on server restart)

### Input Validation

Every question goes through validation before processing:

| Check | Rule | Error |
|-------|------|-------|
| Presence | `question` field must exist | 400: "Question is required" |
| Type | Must be a string | 400: "Question must be a string" |
| Length | Must be non-empty after trimming | 400: "Question cannot be empty" |
| Max length | Cannot exceed configured max | 400: "Question too long" |

### Error Handling

- All controller methods are wrapped in try/catch
- Errors are logged to `errors.log` with full stack traces
- User-facing error responses never expose internal details
- AI provider failures return a generic "Failed to process" message

---

## Logging & Observability

### Query Log (`logs/queries.log`)

Every Q&A interaction is logged:

```
[2025-01-15T10:30:00.000Z] QUERY
  Question: What happens when an order is dispatched?
  Answer: When an order is dispatched, the system...
  Duration: 1847ms
  Documents Searched: 3
  ---
```

### Error Log (`logs/errors.log`)

All errors with context:

```
[2025-01-15T10:31:00.000Z] ERROR
  Context: askController.handleQuestion
  Message: GROQ API returned 429
  Stack: Error: GROQ API returned 429
    at aiService.ask (src/services/aiService.js:45:11)
    ...
  ---
```

### Health Monitoring

`GET /api/health` provides real-time diagnostics:
- Server uptime
- Active AI provider and model
- Number of loaded knowledge documents
- Useful for monitoring dashboards and alerts

---

## Quick Start

### Prerequisites

- **Node.js** v18+
- An API key for at least one AI provider (Groq recommended — free tier available at [console.groq.com](https://console.groq.com))

### 1. Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your API key:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
AI_MODEL=llama-3.1-8b-instant
PORT=3000
```

### 3. Add Knowledge Files

Add your internal documentation as `.md` or `.txt` files to the `knowledge/` directory.

### 4. Build & Run

```bash
# Build Vue frontend
cd client && npm run build && cd ..

# Start server
node server.js
```

Open **http://localhost:3000**

---

## Configuration Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `AI_PROVIDER` | `groq` | AI provider (`groq`, `openai`, `anthropic`) |
| `AI_MODEL` | `llama-3.1-8b-instant` | Model identifier for the active provider |
| `GROQ_API_KEY` | — | Groq API key |
| `OPENAI_API_KEY` | — | OpenAI API key |
| `ANTHROPIC_API_KEY` | — | Anthropic API key |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX` | `20` | Max requests per rate limit window |

---

## Development Mode

Run backend and frontend separately for hot-reloading:

```bash
# Terminal 1: Start backend
node server.js

# Terminal 2: Start Vue dev server with hot reload
cd client && npm run dev
```

- **Frontend dev server:** http://localhost:5173 (with hot module replacement)
- **Backend API:** http://localhost:3000
- Vite automatically proxies `/api/*` requests to the backend

---

## License

MIT
