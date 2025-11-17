console.log("Starting import test...");
try {
  console.log("Importing config/redis.js...");
  await import("./config/redis.js");
  console.log("✓ Redis config imported successfully");
  
  console.log("Importing utils/consistentHash.js...");
  await import("./utils/consistentHash.js");
  console.log("✓ ConsistentHash imported successfully");
  
  console.log("Importing app.js...");
  await import("./app.js");
  console.log("✓ App imported successfully");
} catch (e) {
  console.error("Import failed:", e);
}
