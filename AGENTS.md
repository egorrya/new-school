# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.

## Source layout

Keep route conventions in `src/app/` and implementation code outside it:

```txt
src/
├── app/                  # Next.js route files, layouts, metadata, route handlers
├── cms/                  # Payload collections, globals, fields, access, hooks, plugins, migrations
├── features/             # domain screens and UI (news, gallery, vacancies, etc.)
│   └── page-builder/     # Payload block schema and React view colocated by block
├── server/               # Payload queries, server-only form logic and SEO helpers
├── shared/               # reusable components, UI primitives, hooks and pure utilities
├── payload.config.ts     # Payload entry point; keep the @payload-config alias stable
└── payload-types.ts      # generated; never edit by hand
```

- `src/app/` owns URL mapping and Next.js special exports only. Put page composition, queries and UI in `src/features/`.
- Keep a Payload block's `schema.ts`, server view and client leaves in the same `src/features/page-builder/blocks/<Block>/` directory. Register schemas in `src/features/page-builder/schema.ts` and render them through `RenderBlocks.tsx`.
- Put CMS configuration under `src/cms/`; use `@/cms/...` imports. After changing its schema or admin component path, run `npm run generate:types` and `npm run generate:importmap`.
- Put Payload access and cached queries in `src/server/`, not in `shared/` or client components. `shared/` must not import Payload or `next/headers`.
- Use the `@/` alias rather than restoring retired roots such as `src/collections`, `src/blocks`, `src/components`, `src/utilities` or `src/lib`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
