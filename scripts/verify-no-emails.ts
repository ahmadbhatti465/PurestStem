import fs from "fs";
import path from "path";

function checkNoEmails() {
  const dir = path.join(process.cwd(), "data", "test-generated-pdfs");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".pdf"));

  console.log(`Checking ${files.length} PDF files for email exposure...`);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  let violations = 0;
  for (const file of files) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const matches = content.match(emailRegex);

    if (matches && matches.length > 0) {
      console.error(`❌ VIOLATION in ${file}: Found email(s) ->`, matches);
      violations++;
    } else {
      console.log(`✓ ${file}: ZERO emails detected.`);
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Found ${violations} email violations!`);
    process.exit(1);
  } else {
    console.log(`\n✅ 100% CLEAN: No customer, admin, or business email exists in any generated PDF document.`);
  }
}

checkNoEmails();
