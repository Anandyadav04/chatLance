import jwt from "jsonwebtoken";

import User from "../models/User.js";

import env from "../config/env.js";

import roomSocket from "./roomSocket.js";
import messageSocket from "./messageSocket.js";

const socketHandler = (io) => {

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {

      // Get token from client auth
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      // Verify JWT
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Find user
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach authenticated user to socket
      socket.user = user;

      next();

    } catch (error) {

      next(new Error("Authentication failed"));

    }
  });

  // Connection Event
  io.on("connection", (socket) => {

    console.log(
      `User Connected: ${socket.user.username}`
    );

    roomSocket(io, socket);
    
    messageSocket(io, socket);

    console.log(
      `Socket ID: ${socket.id}`
    );

    // Test Event
    socket.on("ping", () => {

      console.log(
        `Ping from ${socket.user.username}`
      );

      socket.emit("pong");

    });

    // Disconnect Event
    socket.on("disconnect", () => {

      console.log(
        `${socket.user.username} disconnected`
      );

    });

  });

};

export default socketHandler;