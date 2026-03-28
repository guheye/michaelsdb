# Michael's Daily Brief (michaelsdb)

An intellectual conservative news aggregator built with Next.js: RSS ingestion, SQLite storage, optional AI-rewritten headlines, and a reader-focused UI.

## Stack

- **Framework:** Next.js 16 (App Router), React 19
- **Data:** SQLite via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) and [Drizzle ORM](https://orm.drizzle.team/)
- **Feeds:** RSS parsing and aggregation pipelines under `src/lib/feeds/`
- **AI:** Anthropic API for headline rewriting (`src/lib/ai/`)
- **Styling:** Tailwind CSS v4

## Prerequisites

- Node.js (LTS recommended) and npm

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Environment variables:

   ```bash
   cp .env.example .env.local
   ```

   - **`ANTHROPIC_API_KEY`** — Required for AI headline rewriting.
   - **`UNSPLASH_ACCESS_KEY`** — Optional; helps backfill images when feeds do not provide them.

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

The app creates and uses a local SQLite database file in the project root (see `src/lib/db/index.ts`). Database files are gitignored.

## Scripts

| Command        | Description        |
| -------------- | ------------------ |
| `npm run dev`  | Development server |
| `npm run build`| Production build   |
| `npm run start`| Production server  |
| `npm run lint` | ESLint             |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). This project uses the [Contributor Covenant](CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
