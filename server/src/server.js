import http from "http";
import { Server } from "socket.io"
import dotenv from "dotenv";

import app from "./app.js";

import env from "./config/env.js";
import connectDB from "./config/db.js";
import socketHandler from "./sockets/socketHandler.js";

connectDB();

const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

socketHandler(io);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
})