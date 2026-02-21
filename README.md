# DumpIt Backend

DumpIt Backend is an anonymous, moderation-first REST API for posting "dumps" and comments without creating user accounts. It uses cookie-based anonymous sessions, MongoDB persistence, and Gemini-powered moderation to keep content safer while preserving user anonymity.

## Features

- **Anonymous session lifecycle**
  - Start and validate anonymous sessions via HTTP-only cookies.
  - Rotate/recreate sessions when expired.
  - Delete sessions on demand.

- **Dump management (CRUD + moderation flow)**
  - Create dumps as drafts.
  - Publish dumps through AI moderation.
  - Auto-transition dump visibility based on moderation outcomes:
    - `Draft` -> `Processing` -> `Visible` (allowed)
    - `Draft` -> `Processing` -> `Hidden` (rejected)
    - `Draft` -> `Processing` (manual review path)
  - List dumps with filters (`status`, `topic`) sorted by latest first.
  - Get, update, and delete dump entries.

- **Comment management (nested under dumps)**
  - Create comments as drafts or publish immediately.
  - Moderate comments before visibility changes.
  - List visible comments for a dump.
  - Update and delete comment entries.

- **Ownership & session authorization**
  - Session-required access for dump APIs.
  - Middleware-enforced ownership checks for modifying dumps/comments.
  - Prevents cross-session edits.

- **AI moderation engine integration**
  - Uses Gemini model with deterministic generation config.
  - Structured label scoring (`hate`, `harassment`, `sexual`, `violence`, `self_harm`).
  - Rule-based policy decisions: `allow`, `review`, `reject`.

- **Robust data modeling with Mongoose**
  - Session, Dump, Comment core entities.
  - Additional moderation/reporting entities:
    - ModerationAnalysis
    - ModerationAction
    - Report

- **Backend quality tooling**
  - ESLint and Prettier scripts for consistent code quality.
  - Nodemon-based development run command.

## Technical Detailing

### Architecture Overview

- **Framework**: Express 5 with modular separation:
  - Route layer (`src/routes/*`)
  - Controller layer (`src/contollers/*`)
  - Middleware layer (`src/midddlewares/*`)
  - Model layer (`src/models/*`)
  - Utility layer (`src/utils/*`)
- **Database**: MongoDB with Mongoose ODM.
- **Runtime**: Node.js (ESM modules).
- **Config**: Environment variables via `dotenv`.

### Session Security Design

- Generates random UUID session token.
- Stores only SHA-256 hash of token in DB.
- Sends raw token to client in HTTP-only cookie.
- Validates active/expiry state on protected routes.

### Moderation Decision Flow

1. Content submitted with `action = Publish`.
2. Content marked `Processing`.
3. Gemini model returns toxicity labels.
4. Rule engine applies thresholds:
   - high-risk => `reject`
   - medium-risk => `review`
   - low-risk => `allow`
5. Final visibility/status is persisted and returned in API response.

### API Surface (high level)

- `/api/v1/session`
  - `POST /start-session`
  - `DELETE /delete-session`
- `/api/v1/dump`
  - `GET /`
  - `POST /`
  - `GET /:dumpId`
  - `PATCH /:dumpId`
  - `DELETE /:dumpId`
- `/api/v1/dump/:dumpId/comments`
  - `GET /`
  - `POST /`
  - `GET /:commentId`
  - `PATCH /:commentId`
  - `DELETE /:commentId`

## Tech Stack

- **Backend**: Node.js, Express 5
- **Database**: MongoDB, Mongoose
- **Moderation/AI**: Google Generative AI (Gemini)
- **Security/Utilities**: cookie-parser, uuid, crypto, dotenv
- **DX Tooling**: nodemon, ESLint, Prettier

## Development

```bash
npm run dev
```

## Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format
```
