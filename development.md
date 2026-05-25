# Development Notes

## Development setup

Only the database runs in Docker. The NestJS app runs on the host via `make dev`, which starts the DB container, waits for it to be ready, then runs `nest start --watch`.

We started with a fully containerized setup (app + DB both in Docker) but moved away from it due to several compounding issues:

- **File deletions not reflected in the container** — deleting a migration file on the host did not remove it from the container, causing stale migrations to be loaded.
- **Docker Compose Watch sync is host→container only** — generated files (e.g. TypeORM migration files) created inside the container were not written back to the host filesystem, requiring a separate bidirectional bind mount for `src/migrations/`.
- **ESM/CJS conflicts with containerized tooling** — running the TypeORM CLI inside the container required a custom npm script wrapping ts-node, and migration files had to be pointed at compiled `.js` output rather than `.ts` source to avoid Node's ESM resolver errors.
- **Bind mount quirks** — mounting the full project directory (`. :/app`) with an anonymous volume for `node_modules` caused subtle issues; the simpler Docker Compose Watch approach introduced its own sync noise and limitations.

Running only the DB in Docker sidesteps all of this. The DB is the only thing that's awkward to run locally without Docker; the app runs naturally on the host with full filesystem access.

## TypeScript module system

The tsconfig uses `"module": "commonjs"` rather than `"nodenext"`. NestJS is a CommonJS framework — its CLI, ts-node integration, and tooling (TypeORM CLI, Jest) all assume CommonJS. Using `"nodenext"` enables strict ESM resolution rules that conflict with how these tools load TypeScript files at runtime, requiring workarounds like glob entity patterns and custom npm scripts to wrap the TypeORM CLI. CommonJS avoids all of that with no practical downside: `import`/`export` syntax still works in source files — TypeScript compiles it to `require()`/`module.exports` on output.

## TypeORM DataSource

The TypeORM config lives in `src/data-source.ts` and is shared with `src/app.module.ts` via `dataSource.options`. Both files must be kept in sync when adding new entities.

**`src/data-source.ts`** is used by the TypeORM CLI for migration generation and manual migration runs. The CLI is invoked via the `typeorm` npm script (see `package.json`) rather than `npx typeorm` directly. This is because the CLI uses a dynamic `import()` to load `data-source.ts`, which goes through Node's ESM resolver and fails on extensionless imports. The `typeorm` script wraps the CLI with `ts-node`, which handles TypeScript loading correctly under CommonJS.

**`src/app.module.ts`** spreads `dataSource.options` but overrides two options:
- `entities` — NestJS's dependency injection requires explicit class references, not file globs.
- `migrations` — uses `__dirname` to point to compiled `.js` files in `dist/migrations/`. At runtime TypeORM loads migrations via dynamic `import()` which goes through Node's ESM resolver; pointing to compiled CJS `.js` files avoids the ESM named-export errors that occur when loading raw `.ts` migration files. `nest start --watch` compiles to `dist/` as it runs, so the `.js` files are always available.

### Adding a new entity

1. Create the entity class (e.g. `src/articles/entities/article.entity.ts`).
2. Add it to the `entities` array in both `data-source.ts` and `app.module.ts`.
3. Generate a migration using the Makefile target:
   ```
   make migrate:generate name=<MigrationName>
   ```
4. Migrations run automatically on app startup via `migrationsRun: true`.
