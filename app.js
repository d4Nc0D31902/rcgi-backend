const express = require("express");
const compression = require("compression");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });

const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const course = require("./routes/course");
const modules = require("./routes/module");
const chapter = require("./routes/chapter");
const lesson = require("./routes/lesson");
const enrollment = require("./routes/enrollment");
const quiz = require("./routes/quiz");
const feedback = require("./routes/feedback");
const notification = require("./routes/notification");
const forum = require("./routes/forum");

const errorMiddleware = require("./middlewares/errors");

app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

app.use(express.json({ limit: "10mb" })); // Reduce the limit if possible
// app.set("trust proxy", 1);
app.use(
  cors({
    // origin: process.env.LOCAL_API,
    // origin: process.env.RENDER_API,
    origin: process.env.VERCEL_API,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Reduce the limit if possible

// Ensure to handle large responses efficiently
const sendLargeResponse = (res, data) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  let start = 0;
  let end = chunkSize;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  while (start < data.length) {
    const chunk = data.slice(start, end);
    res.write(JSON.stringify(chunk));
    start = end;
    end = start + chunkSize;
  }
  res.end();
};

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", course);
app.use("/api/v1", modules);
app.use("/api/v1", chapter);
app.use("/api/v1", lesson);
app.use("/api/v1", enrollment);
app.use("/api/v1", quiz);
app.use("/api/v1", notification);
app.use("/api/v1", feedback);
app.use("/api/v1", forum);

app.use(errorMiddleware);
module.exports = app;
