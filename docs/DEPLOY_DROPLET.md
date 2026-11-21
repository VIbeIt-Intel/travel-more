# Database on the Droplet (not deploying now)

Nothing in this file is being done yet. No DNS changes, no server, no Cloudflare changes.

Local development uses SQLite. Production on the DigitalOcean Droplet uses PostgreSQL. The Prisma models are limited to types both databases support (strings, integers, booleans, datetimes). There are no enums, JSON columns, decimals, or Postgres-only types.

## The only database switch

Two settings, both in the server env file:

```
DATABASE_PROVIDER=postgresql
DATABASE_URL=postgresql://travelmore:PASSWORD@127.0.0.1:5432/travelmore?schema=public
```

`scripts/prisma-provider.mjs` rewrites the single `provider` line in `prisma/schema.prisma` from `DATABASE_PROVIDER` before `prisma generate` and `prisma migrate`. You do not edit the models.

Local values stay:

```
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./data/office.db
```

The local file is `data/office.db`, gitignored. Prisma 7.10.1 reads that URL from `prisma.config.ts`. The schema has no `url` line. Local queries use `@prisma/adapter-better-sqlite3`.

The checked-in migration SQL is SQLite. Do not run it against Postgres (`DATETIME` is not a Postgres type). On the first Droplet boot, with the provider set to postgresql and an empty database, create a Postgres migration instead:

```
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script --output prisma/migrations/postgres_init/migration.sql
npx prisma migrate deploy
```

Install `@prisma/adapter-pg@7.10.1` and `pg` on the Droplet, then connect `src/lib/db.ts` with `PrismaPg` when `DATABASE_PROVIDER=postgresql`. Until that package is installed, the local client only opens SQLite.

## Postgres on the Droplet

Install PostgreSQL on the same Droplet. It listens on localhost only.

```
sudo -u postgres createuser --pwprompt travelmore
sudo -u postgres createdb --owner=travelmore travelmore
```

Confirm `listen_addresses` is `localhost` and the firewall does not expose port 5432.

From the app directory, with the production env file loaded:

```
npm run db:generate
npx prisma migrate deploy
npm run db:seed
npm run migrate:json
```

`migrate deploy` applies the committed migrations. It does not prompt. `db:seed` creates the owner from `OFFICE_PASSWORD` and `OFFICE_OWNER_EMAIL` if that user is not there yet. `migrate:json` copies `data/specials.json` and `data/enquiries.json` into the database and does not change those files.

Take a nightly `pg_dump` as well as the Droplet backups. Restore with `psql` into an empty database, then start the app. Uploaded files live in `STORAGE_DIR` and need to be in the same backup set.

The rest of the Droplet (Ubuntu, Caddy, systemd, the public-site decision) is still to be written when that move is actually planned.
