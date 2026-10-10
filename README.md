# Ticket Categorisation System – Prototype

🇭🇺 [Magyar nyelvű változat](README.hu.md)

> **⚠️ Demonstration prototype.** Built solely to compare semantic (embedding-based)
> and LLM-based ticket classification. It is not production-ready:
> - The auth is intentionally minimal (a single password + a static, unsigned cookie)
>   and provides NO real protection.
> - There is no input validation, rate limiting, database or test suite.
> - Submitted text is sent to the OpenAI API, so do not enter real personal or
>   confidential data.
> - If you deploy it publicly, set a spending limit on your OpenAI account.

Prototype of a ticket categorisation module for a media agency's ticket system. The user describes their problem in free text; the system automatically assigns it to the matching category and suggests alternatives.

---

## Features

- Free-text problem description input
- Automatic category assignment using two different methods (semantic / LLM)
- Top 3 categories returned – Top 1 is selected automatically, Top 2–3 are offered as alternatives
- Manual override
- Threshold-based rejection – if no clear category is found, the system asks for clarification
- Automatic re-search after the description is edited
- Detailed system log for development and analysis
- Password protection – the page is only accessible after login

---

## Search modes

The prototype supports two search modes, switchable in the UI. This allows a direct comparison of the two methods on the same ticket.

### Semantic search

All category descriptions are converted to embedding vectors (once, on first use, via lazy initialisation) and kept in server memory. The user's text is also converted to an embedding, and cosine similarity is used to find the top 3 best-matching categories.

- Fast and cheap (no LLM call at search time)
- Score: cosine similarity value between 0 and 1
- Threshold: `0.40` – below this the system asks for clarification

### LLM search

The user's text together with the name + description of every category is sent in an OpenAI chat completion prompt. The LLM returns the top 3 categories as JSON, with a confidence value and a short justification in Hungarian.

- More accurate, context-aware classification
- Score: the confidence value given by the LLM (0–100), normalised to 0–1
- The system log includes token usage and response time
- Model: `gpt-4o-mini` (configurable via the `LLM_MODEL` constant in `lib/llm.ts`)

---

## Tech stack

- **Framework:** Next.js (App Router)
- **Frontend:** React, Tailwind CSS 4 (CSS-first)
- **AI / Embedding:** OpenAI API – `text-embedding-3-small`
- **LLM:** OpenAI API – `gpt-4o-mini`
- **Storage:** in-memory (prototype) → vector DB in production (e.g. pgvector, Pinecone)

---

## Project structure

```
/
├── proxy.ts                      # Password protection – runs before every request (Next.js 16: proxy, formerly middleware)
├── app/
│   ├── page.tsx                  # Main page (UI)
│   ├── globals.css               # Tailwind CSS 4 base styles
│   ├── login/
│   │   └── page.tsx              # Login page
│   └── api/
│       ├── auth/route.ts         # Password check, session cookie
│       ├── setup/route.ts        # Category embedding generation
│       ├── search/route.ts       # Search (semantic or LLM)
│       └── submit/route.ts       # Ticket submission
├── data/
│   └── categories.ts             # Categories and their descriptions
├── lib/
│   ├── embeddings.ts             # OpenAI embedding call
│   ├── similarity.ts             # Cosine similarity calculation
│   ├── cache.ts                  # Embedding cache (server memory)
│   ├── setup.ts                  # Shared cache initialisation logic
│   ├── llm.ts                    # OpenAI chat completion based search
│   └── logger.ts                 # Log entry helper
├── public/
│   └── categories.html           # Category list (accessible without password)
├── types.ts                      # TypeScript type definitions
├── .env.local                    # API key and password (not versioned, create manually)
├── README.md                     # English documentation (this file)
└── README.hu.md                  # Hungarian documentation
```

---

## Installation and running

### 1. Install dependencies

Requirements: Node.js 20+ and an OpenAI API key.

```bash
npm install
```

### 2. Set environment variables

Copy `.env.example` to `.env.local` in the project root (`cp .env.example .env.local`) and fill in the values:

```env
OPENAI_API_KEY=sk-...
PROTOTYPE_PASSWORD=...
```

### 3. Start the development server

```bash
npm run dev
```

The application is available at [http://localhost:3000](http://localhost:3000).

> **Note:** If the dev server crashes with a heap out of memory error after running for a long time, add this to `package.json`:
> ```json
> "scripts": {
>   "dev": "NODE_OPTIONS='--max-old-space-size=8192' next dev"
> }
> ```

---

## Password protection

The page requires login. The session cookie is valid for 7 days (`app/api/auth/route.ts`), after which you must log in again.

The password is set via the `PROTOTYPE_PASSWORD` environment variable – locally in `.env.local`, on Vercel under the project's **Settings → Environment Variables**.

If `PROTOTYPE_PASSWORD` is not set, login always fails.

The `/public/categories.html` page is accessible without a password because it is served as a static file.

---

## API routes

| Route | Method | Description |
|---|---|---|
| `/api/auth` | `POST` | Password check, sets the session cookie (7 days) |
| `/api/setup` | `GET` | Generates the category embedding vectors. Called by the client on page load; if the cache is empty it is generated and kept in server memory. |
| `/api/search` | `POST` | Runs a search. Body: `{ description: string, mode: "semantic" \| "llm" }`. On a cold start it rebuilds the cache automatically. |
| `/api/submit` | `POST` | Submits a ticket. Body: `{ description, categoryId, categoryName, mode, searchMode }` |

---

## Cold start handling (Vercel)

In a Vercel serverless environment server memory is not persistent – on a cold start the cache is lost. The `/api/search` route therefore does not return a 503 error, but rebuilds the cache automatically using the `ensureCacheReady()` function in `lib/setup.ts`. A `"Cache üres (cold start)"` entry in the system log indicates when this happened.

---

## System log

The log panel at the bottom of the page shows the system's operation in real time. In a production system these entries would be stored in a database and used for the following purposes:

| Log category | Analysis goal |
|---|---|
| `SEARCH` – score values | Threshold tuning |
| `RESULT` – automatic vs. manual | Measuring classification accuracy |
| `ACTION` – manual overrides | Identifying misclassifications |
| `RESULT` – failed classifications | Improving category descriptions |
| `SEARCH` – LLM token usage | Cost estimation and optimisation |
| `INPUT` – description length | Correlation with classification quality |
| `SUBMIT` – search mode | Semantic vs. LLM comparison |

---

## Fake categories

The prototype contains 18 fictional media agency categories in the following areas: broadcasting, online streaming, ad management, content and editorial, IT infrastructure, billing, HR, rights management, customer service, social media, internal communication.

The categories and their descriptions are in `data/categories.ts`. Embedding quality depends heavily on how detailed the descriptions are – the more typical example cases a description contains, the more accurate the classification.

> **Disclaimer:** The 18 categories are entirely generated sample data, created for demonstration purposes only. They do not describe any real organisation, system or process; any resemblance to real ones is purely coincidental.

> **Note:** The UI, category data and LLM prompts are in Hungarian.

---

## Moving to production

The prototype's architecture matches that of the intended final system, with the following differences:

| | Prototype | Production |
|---|---|---|
| Number of categories | 18 | ~150 |
| Embedding storage | Server memory | Vector DB (pgvector / Pinecone) |
| Embedding regeneration | Manual (server restart) | Automatic when a category changes |
| Log storage | UI only | Database + analysis pipeline |
| Backend | Next.js API routes | To be determined |
| Authentication | Simple password + cookie | To be determined |

---

## License

MIT – see [LICENSE](LICENSE).
