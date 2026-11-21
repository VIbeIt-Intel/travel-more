import { defineConfig } from "prisma/config";

// Connection URL lives here, not in the schema. The Droplet changes DATABASE_URL.
// The schema provider line is switched by scripts/prisma-provider.mjs from DATABASE_PROVIDER.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL || "file:./data/office.db",
  },
});
