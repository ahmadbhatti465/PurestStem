import "dotenv/config";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const tables = ["User", "Category", "Product", "Order", "OrderItem", "BlogPost", "CartItem", "Review", "ContactMessage"];
  for (const t of tables) {
    const r = await client.execute(`SELECT COUNT(*) as c FROM "${t}"`);
    console.log(`${t}: ${r.rows[0].c}`);
  }
}

main().finally(() => client.close());