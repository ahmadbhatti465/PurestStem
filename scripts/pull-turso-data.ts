import "dotenv/config";
import { createClient, type InValue } from "@libsql/client";

type DataRow = Record<string, unknown>;
const message = (error: unknown) => (error instanceof Error ? error.message : String(error));
import fs from "fs";
import path from "path";

export async function pullAndSeedTursoData() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const localDbUrl = process.env.DATABASE_URL?.startsWith("file:")
    ? process.env.DATABASE_URL
    : "file:./dev.db";

  const tablesToPull = [
    "User",
    "Category",
    "Product",
    "BlogPost",
    "Redirect",
    "Review",
    "ContactMessage",
    "Order",
    "OrderItem",
  ];

  const dataDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const backupPath = path.join(dataDir, "turso-backup.json");

  let pulledData: Record<string, DataRow[]> = {};
  let pulledFromOnline = false;

  if (tursoUrl && tursoUrl.startsWith("libsql")) {
    console.log(`🌐 Connecting to Turso online: ${tursoUrl.split("@").pop()?.split("?")[0]}...`);
    const tursoClient = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });

    try {
      console.log("📥 Fetching online data from Turso...");
      for (const table of tablesToPull) {
        try {
          const res = await tursoClient.execute(`SELECT * FROM [${table}]`);
          pulledData[table] = res.rows;
          console.log(`   ✓ ${table}: ${res.rows.length} rows`);
        } catch (err) {
          console.warn(`   ⚠️ Warning: failed to fetch ${table}: ${message(err)}`);
          pulledData[table] = [];
        }
      }
      pulledFromOnline = true;

      // Save full snapshot of Turso data
      fs.writeFileSync(backupPath, JSON.stringify(pulledData, null, 2), "utf-8");
      console.log(`💾 Saved snapshot to ${path.relative(process.cwd(), backupPath)}`);

      // Also update data/backup.json for legacy scripts
      const legacyBackupPath = path.join(dataDir, "backup.json");
      const legacyBackup = {
        categories: pulledData.Category || [],
        products: pulledData.Product || [],
        users: pulledData.User || [],
        orders: pulledData.Order || [],
        orderItems: pulledData.OrderItem || [],
        blogPosts: pulledData.BlogPost || [],
        cartItems: [],
        reviews: pulledData.Review || [],
        contactMessages: pulledData.ContactMessage || [],
      };
      fs.writeFileSync(legacyBackupPath, JSON.stringify(legacyBackup, null, 2), "utf-8");
    } catch (netErr) {
      console.warn(`⚠️ Could not complete fetch from Turso online: ${message(netErr)}`);
    } finally {
      await tursoClient.close();
    }
  }

  // Fallback to local snapshot if online fetch didn't happen
  if (!pulledFromOnline) {
    if (fs.existsSync(backupPath)) {
      console.log(`📂 Loading offline data from ${path.relative(process.cwd(), backupPath)}...`);
      pulledData = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
    } else {
      console.error("❌ No online connection and no data/turso-backup.json snapshot found.");
      process.exit(1);
    }
  }

  console.log(`💾 Connecting to local database: ${localDbUrl}...`);
  const localClient = createClient({
    url: localDbUrl,
  });

  console.log("\n🌱 Seeding database with Turso data...");
  await localClient.execute("PRAGMA foreign_keys = OFF;");

  try {
    for (const table of tablesToPull) {
      const rows = pulledData[table] || [];

      // Check existing columns in local table
      const infoRes = await localClient.execute(`PRAGMA table_info([${table}])`);
      if (infoRes.rows.length === 0) {
        console.warn(`   ⚠️ Table ${table} does not exist in local database, skipping.`);
        continue;
      }
      const allowedCols = new Set(infoRes.rows.map((r) => r.name));

      // If Turso has 0 orders, preserve existing local orders so local test orders aren't lost
      if ((table === "Order" || table === "OrderItem") && rows.length === 0) {
        const existingCount = await localClient.execute(`SELECT COUNT(*) as c FROM [${table}]`);
        console.log(`   ℹ ${table}: 0 rows in Turso, keeping ${existingCount.rows[0].c} existing local rows.`);
        continue;
      }

      // Clear existing local data for this table
      await localClient.execute(`DELETE FROM [${table}]`);

      if (rows.length === 0) {
        console.log(`   ✓ ${table}: cleared (0 rows in Turso)`);
        continue;
      }

      // Insert each row with only compatible columns
      for (const row of rows) {
        const colsToInsert: string[] = [];
        const values: InValue[] = [];

        for (const [key, val] of Object.entries(row)) {
          if (allowedCols.has(key)) {
            colsToInsert.push(`[${key}]`);
            values.push(val as InValue);
          }
        }

        if (colsToInsert.length === 0) continue;

        const placeholders = colsToInsert.map(() => "?").join(", ");
        const sql = `INSERT INTO [${table}] (${colsToInsert.join(", ")}) VALUES (${placeholders})`;

        try {
          await localClient.execute({ sql, args: values });
        } catch (insertErr) {
          console.error(`   ✗ Error inserting into ${table} (${String(row.id ?? "unknown")}): ${message(insertErr)}`);
        }
      }

      console.log(`   ✓ ${table}: imported ${rows.length} rows`);
    }
  } finally {
    await localClient.execute("PRAGMA foreign_keys = ON;");
  }

  // Verification
  console.log("\n📊 Verification of local database (dev.db):");
  for (const table of tablesToPull) {
    try {
      const countRes = await localClient.execute(`SELECT COUNT(*) as c FROM [${table}]`);
      console.log(`   • ${table}: ${countRes.rows[0].c}`);
    } catch {
      // ignore
    }
  }

  await localClient.close();
  console.log("\n✅ Database seed completed successfully!");
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  pullAndSeedTursoData().catch((err) => {
    console.error("❌ Fatal error seeding from Turso:", err);
    process.exit(1);
  });
}
