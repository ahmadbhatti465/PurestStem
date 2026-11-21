import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const localUrl = process.env.DATABASE_URL?.startsWith("file:")
    ? process.env.DATABASE_URL
    : "file:./dev.db";

  const tables = [
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

  console.log("==================================================");
  console.log("       PURESTSTEM DATABASE STATUS COMPARISON      ");
  console.log("==================================================");

  let tursoClient: ReturnType<typeof createClient> | null = null;
  if (tursoUrl && tursoUrl.startsWith("libsql")) {
    console.log(`🌐 Turso Online: ${tursoUrl.split("@").pop()?.split("?")[0]}`);
    tursoClient = createClient({ url: tursoUrl, authToken: tursoToken });
  } else {
    console.log("⚠️ TURSO_DATABASE_URL not configured for online connection.");
  }

  console.log(`💾 Local Database: ${localUrl}`);
  const localClient = createClient({ url: localUrl });
  console.log("--------------------------------------------------");
  console.log(
    `${"Table".padEnd(16)} | ${"Turso (Online)".padEnd(14)} | ${"Local (dev.db)".padEnd(14)}`
  );
  console.log("--------------------------------------------------");

  for (const t of tables) {
    let tursoCount = "-";
    let localCount = "-";

    if (tursoClient) {
      try {
        const r = await tursoClient.execute(`SELECT COUNT(*) as c FROM [${t}]`);
        tursoCount = String(r.rows[0].c);
      } catch {
        tursoCount = "err";
      }
    }

    try {
      const r = await localClient.execute(`SELECT COUNT(*) as c FROM [${t}]`);
      localCount = String(r.rows[0].c);
    } catch {
      localCount = "err";
    }

    console.log(
      `${t.padEnd(16)} | ${tursoCount.padStart(14)} | ${localCount.padStart(14)}`
    );
  }

  console.log("==================================================");

  if (tursoClient) await tursoClient.close();
  await localClient.close();
}

main().catch(console.error);