# Contributing

Thanks for your interest in this project.

## Development setup

1. Install [Node.js](https://nodejs.org/) (LTS recommended) and npm.
2. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Set `ANTHROPIC_API_KEY` for AI-powered headline rewriting. `UNSPLASH_ACCESS_KEY` is optional and improves image backfill when feeds omit images.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

5. Before opening a pull request, run the linter:

   ```bash
   npm run lint
   ```

## Editorial scope

Product direction and editorial principles are documented in [CHARTER.md](CHARTER.md). Code contributions should respect that document; substantive editorial changes are best discussed in an issue first.

## Pull requests

- Prefer focused PRs with a clear description of what changed and why.
- Link related issues when applicable.
- Ensure `npm run lint` passes.

## Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Participation is subject to its terms.
