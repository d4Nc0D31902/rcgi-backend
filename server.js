const app = require("./app");
const connectDatabase = require("./config/database");
const path = require("path");
const cloudinary = require("cloudinary");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDatabase();
console.log(process.env.DATABASE);

if (process.env.NODE_ENV !== "PRODUCTION")
  require("dotenv").config({ path: "backend/config/.env" });

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://rcgi-frontend.vercel.app"],
    credentials: true,
  },
});

// Manually set CORS headers for Socket.IO responses
io.use((socket, next) => {
  socket.handshake.headers.origin = socket.handshake.headers.origin || "*";
  next();
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

global.io = io;

server.listen(process.env.PORT, () => {
  console.log(
    `Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});
