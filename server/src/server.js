import http from "http";
import { Server } from "socket.io"
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config()

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})