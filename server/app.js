import express from "express";
import db from "./config/db.js";
import areaRoutes from "./routes/areaRoutes.js";
import binRoutes from "./routes/binRoutes.js";

const app = express();
app.use(express.json());

//connect to db
console.log("App started, DB should be connected.");

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

//routes
app.use("/api/areas", areaRoutes);
app.use("/api/bins", binRoutes);


// Graceful shutdown of the database connection
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
