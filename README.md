# DumpIt Backend

Anonymous, moderation-first REST API for posting "dumps" and comments without user accounts. Uses cookie-based anonymous sessions, MongoDB persistence, and AI-powered moderation.

## Features

- **Anonymous session lifecycle** — Start, validate, rotate, and delete sessions via HTTP-only cookies
- **Dump management** — CRUD with Draft → Processing → Visible/Hidden status lifecycle
- **Comment management** — Nested under dumps with same moderation flow
- **AI moderation** — Gemini (dumps) and Ollama (comments) with rule-based toxicity scoring
- **Ownership enforcement** — Middleware prevents cross-session edits
- **Input validation** — Joi schemas reject malformed requests before controllers
- **Rate limiting** — 100 requests per 15 minutes per IP

## Architecture

```
src/
├── controllers/     # Request handlers
├── middlewares/      # Session, ownership, validation, rate limiting
├── models/          # Mongoose schemas (Session, Dump, Comment, Moderation*)
├── routes/          # Express route definitions
├── utils/           # Moderation, hashing, async error handling
├── db/              # MongoDB connection
├── app.js           # Express app setup
└── server.js        # Bootstrap and listen
```

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4
- **Database**: MongoDB + Mongoose ODM
- **AI**: Google Gemini, Ollama
- **Validation**: Joi
- **Security**: SHA-256 hashing, HTTP-only cookies, rate limiting
- **Containerization**: Docker, Docker Compose

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/v1/session/start-session` | No | Create/resume session |
| DELETE | `/api/v1/session/delete-session` | No | End session |
| GET | `/api/v1/dump/public` | No | Public visible dumps |
| GET | `/api/v1/dump/public/:dumpId/comments` | No | Public comments |
| GET | `/api/v1/dump` | Session | List user's dumps |
| POST | `/api/v1/dump` | Session | Create dump |
| GET | `/api/v1/dump/:dumpId` | Session | Get dump |
| PATCH | `/api/v1/dump/:dumpId` | Owner | Update dump |
| DELETE | `/api/v1/dump/:dumpId` | Owner | Delete dump |
| GET | `/api/v1/dump/:dumpId/comments` | Session | List comments |
| POST | `/api/v1/dump/:dumpId/comments` | Session | Create comment |
| PATCH | `/api/v1/dump/:dumpId/comments/:commentId` | Owner | Update comment |
| DELETE | `/api/v1/dump/:dumpId/comments/:commentId` | Owner | Delete comment |

## Development

```bash
npm install
npm run dev
```

## Docker

```bash
docker-compose up --build
```

## Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format
```
