import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

import db from "./config/db.js";
import areaRoutes from "./routes/areaRoutes.js";
import binRoutes from "./routes/binRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

// --- static uploads (make sure dir exists) ---
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR)); 

// --- middlewares ---
app.use(cors()); /
app.use(express.json({ limit: "5mb" })); 

// --- healthcheck ---
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// --- routes ---
app.use("/api/areas", areaRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/images", imageRoutes);

// --- logging ---
console.log("App started, DB should be connected.");

// --- start server ---
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

// --- graceful shutdown ---
function shutdown(signal = "SIGINT") {
  console.log(`\n${signal} received. Closing MySQL connection...`);
  if (db && typeof db.end === "function") {
    db.end((err) => {
      if (err) {
        console.error("Error closing MySQL connection:", err);
      } else {
        console.log("MySQL connection closed.");
      }
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
