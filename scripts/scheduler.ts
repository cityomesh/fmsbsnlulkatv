// scripts/scheduler.ts
import cron from "node-cron";
import fetch from "node-fetch";

cron.schedule("* * * * *", async () => {
  console.log("⏰ Running scheduled task...");

  try {
    const res = await fetch("http://localhost:3000/api/process-orders", {
      method: "POST",
    });

    const data = await res.json() as { message: string };
    console.log(`✅ ${data.message}`);
  } catch (err) {
    console.error("⛔ Failed to call process-orders API:", err);
  }
});
