// const app = require("./app");
// const connectDatabase = require("./config/database");
// const path = require("path");
// const cloudinary = require("cloudinary");

// require("dotenv").config({ path: "./config/.env" });
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// connectDatabase();
// console.log(process.env.DATABASE);
// if (process.env.NODE_ENV !== "PRODUCTION")
//   require("dotenv").config({ path: "backend/config/.env" });
// app.listen(process.env.PORT, () => {
//   console.log(
//     `server started on port:' ${process.env.PORT} in ${process.env.NODE_ENV} mode`
//   );
// });

// RENDER

const app = require("./app");
const connectDatabase = require("./config/database");
const path = require("path");
const cloudinary = require("cloudinary");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
//TRUE SOCKET USE THIS ^

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

//TRUE SOCKET USE THIS
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    // origin: process.env.LOCAL_API,
    origin: process.env.RENDER_API,
    credentials: true,
  },
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
