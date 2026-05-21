const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const usersRouter = require("./routes/users");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  helmet(),
  cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }),
  express.json(),
  morgan("tiny")
);
app.use(rateLimit({ windowMs: 60_000, max: 120, standardHeaders: true, legacyHeaders: false }));

app.get("/", (_, res) => res.send("Backend is running"));
app.use("/api/users", usersRouter);
app.use(notFoundHandler, errorHandler);
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));