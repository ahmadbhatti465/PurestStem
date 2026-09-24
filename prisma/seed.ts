import "dotenv/config";
import { pullAndSeedTursoData } from "../scripts/pull-turso-data";

async function main() {
  console.log("🌱 Starting PurestStem database seed...");
  await pullAndSeedTursoData();
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
