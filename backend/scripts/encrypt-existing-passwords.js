import "dotenv/config";
import connectDB from "../db/db.js";
import { Password } from "../models/password.model.js";
const args = process.argv.slice(2);
const DRY = args.includes("--dry") || args.includes("-d");

const isEncrypted = (val) => {
  if (typeof val !== "string") return false;
  // format: <iv-hex>.<encrypted-hex> where iv is 16 bytes => 32 hex chars
  return /^[0-9a-f]{32}\.[0-9a-f]+$/i.test(val);
};

const run = async () => {
  await connectDB();
  try {
    const total = await Password.countDocuments();
    console.log(`Found ${total} password documents`);

    const cursor = Password.find({}).cursor();
    let checked = 0;
    let skipped = 0;
    let toEncrypt = 0;
    for await (const doc of cursor) {
      checked++;
      const pwd = doc.password;
      if (isEncrypted(pwd)) {
        skipped++;
        continue;
      }

      toEncrypt++;
      console.log(`Will encrypt doc ${doc._id} (userId=${doc.userId})`);
      if (!DRY) {
        // Use updateOne with $set so the model's pre hooks for updateOne
        // will encrypt the password before storing.
        await Password.updateOne({ _id: doc._id }, { $set: { password: pwd } });
        console.log(`Encrypted ${doc._id}`);
      }
    }

    console.log("\nSummary:");
    console.log(`  checked: ${checked}`);
    console.log(`  already encrypted/skipped: ${skipped}`);
    console.log(`  to encrypt: ${toEncrypt}`);
    console.log(`  dry run: ${DRY}`);
    console.log("\nDone");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    process.exit();
  }
};

run();
