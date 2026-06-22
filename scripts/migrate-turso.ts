import "dotenv/config";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const MIGRATIONS = [
  { id: "20260527194622_init", file: "prisma/migrations/20260527194622_init/migration.sql" },
  { id: "20260531173420_add_cart_item", file: "prisma/migrations/20260531173420_add_cart_item/migration.sql" },
];

async function tableExists(name: string): Promise<boolean> {
  const r = await client.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [name]
  );
  return r.rows.length > 0;
}

async function main() {
  console.log("▶ Checking Turso connection...");
  await client.execute("SELECT 1");

  if (await tableExists("_prisma_migrations")) {
    console.log("ℹ _prisma_migrations table already exists");
  } else {
    console.log("▶ Creating _prisma_migrations table");
    await client.execute(`
      CREATE TABLE "_prisma_migrations" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "checksum" TEXT NOT NULL,
        "finished_at" DATETIME,
        "migration_name" TEXT NOT NULL,
        "logs" TEXT,
        "rolled_back_at" DATETIME,
        "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0
      )
    `);
  }

  for (const m of MIGRATIONS) {
    const already = await client.execute(
      `SELECT id FROM _prisma_migrations WHERE migration_name=?`,
      [m.id]
    );
    if (already.rows.length > 0) {
      console.log(`✓ ${m.id} already applied, skipping`);
      continue;
    }

    const sql = fs.readFileSync(path.resolve(process.cwd(), m.file), "utf-8");
    console.log(`▶ Applying ${m.id}...`);
    const statements = sql
      .split(/;\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    for (const stmt of statements) {
      try {
        await client.execute(stmt + ";");
      } catch (e) {
        console.error(`  Error in statement:`, stmt.slice(0, 80));
        throw e;
      }
    }

    await client.execute(
      `INSERT INTO _prisma_migrations (id, checksum, migration_name, finished_at, started_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
      [crypto.randomUUID(), "manual-" + m.id, m.id]
    );
    console.log(`✓ ${m.id} applied`);
  }

  console.log("✅ All migrations applied to Turso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.close();
  });