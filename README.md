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
   - **`SQLITE_PATH`** — Optional; absolute path to the SQLite file. Defaults to `michaelsdb.db` in the current working directory.

3. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

The app creates and uses a SQLite database file (see `src/lib/db/index.ts`). By default the file is `michaelsdb.db` next to the process working directory. Database files are gitignored.

## Deploying on Render (SQLite and data retention)

Cloud instances usually have an **ephemeral filesystem**: redeploys can wipe a database stored in the app directory. To **keep articles and feed data across deploys**:

1. In the [Render Dashboard](https://dashboard.render.com/) for your web service, open **Disks** and **add a persistent disk**. Use mount path **`/var/data`** (any empty path you prefer is fine if you match it in step 2).
2. Under **Environment**, **add** (merge) the variable  
   `SQLITE_PATH=/var/data/michaelsdb.db`  
   Do **not** use “replace all” for environment variables — that can remove API keys. Only add or edit this key.
3. Redeploy. New data will live on the disk and survive future deploys.

**If you already have a database on the old path** (e.g. under the app directory) and want to keep it: after the disk is mounted, use [Render Shell](https://render.com/docs/render-shell) (or a one-off job) to copy the files to the disk before switching traffic, e.g.  
`cp michaelsdb.db* /var/data/`  
(include `-wal` / `-shm` if present, then restart so SQLite reopens cleanly).

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
