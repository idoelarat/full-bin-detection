// app.js
import express from "express";
import db from "./config/db.js";
import areaRoutes from "./routes/areaRoutes.js";
import binRoutes from "./routes/binRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import cors from "cors";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/areas", areaRoutes);
app.use("/api/bins", binRoutes);
app.use("/api/images", imageRoutes);

// static folder for uploaded images
app.use("/uploads", express.static("uploads"));

// DB connect log
console.log("App started, DB should be connected.");

// start server
const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

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
