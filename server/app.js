<<<<<<< HEAD
import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";

=======
// app.js
import express from "express";
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
import db from "./config/db.js";
import areaRoutes from "./routes/areaRoutes.js";
import binRoutes from "./routes/binRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
<<<<<<< HEAD

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
=======
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
app.use("/api/areas", areaRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/images", imageRoutes);

<<<<<<< HEAD
// --- logging ---
console.log("App started, DB should be connected.");

// --- start server ---
=======
// static folder for uploaded images
app.use("/uploads", express.static("uploads"));

// DB connect log
console.log("App started, DB should be connected.");

// start server
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

<<<<<<< HEAD
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
=======
// graceful shutdown
process.on("SIGINT", () => {
  db.end((err) => {
    if (err) {
      console.error("Error closing MySQL connection:", err);
      return;
    }
    console.log("❌ MySQL connection closed.");
    process.exit(0);
  });
});
>>>>>>> 3047e0688a457157a29eac394b451d96f2f6918f
