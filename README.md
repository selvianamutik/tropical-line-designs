# compro_TLD

This repository is initialized to follow the 3-layer workflow described in `AGENT.md`.

## Operating Model

- `directives/` contains SOP-style instructions for tasks.
- `execution/` contains deterministic scripts used to carry out those tasks.
- `.tmp/` stores intermediate files that can be regenerated.

## Start Here

1. Read `AGENT.md`.
2. Pick or create the relevant directive in `directives/`.
3. Reuse an existing script in `execution/` before creating a new one.
4. Keep temporary outputs inside `.tmp/`.

## Baseline Validation

Run the validator to confirm the expected structure is present:

```powershell
python execution/validate_structure.py
```

## Application Stack

The base application is scaffolded for:

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Neon Postgres via `DATABASE_URL`

Core app code lives under `src/`.

## Environment Setup

Copy `.env.example` to `.env` and fill in the required values before enabling database or auth flows.

```powershell
Copy-Item .env.example .env
python execution/validate_env.py
```

For Vercel deployment, install the official Neon integration and let Vercel inject `DATABASE_URL` into the project environments. Vercel's current Postgres flow uses Marketplace integrations, and Neon is the native option for new projects. Sources: Vercel docs and Neon integration page.

## Install And Run

This machine did not have `node`/`npm` available during initialization, so dependencies were not installed automatically.

Once Node.js is available:

```powershell
npm install
npm run dev
```
