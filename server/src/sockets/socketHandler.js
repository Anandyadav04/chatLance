import jwt from "jsonwebtoken";

import User from "../models/User.js";

import env from "../config/env.js";

import roomSocket from "./roomSocket.js";
import messageSocket from "./messageSocket.js";

import onlineUsers from "../services/onlineUsers.js";
import directMessageSocket from "./directMessageSocket.js";

const socketHandler = (io) => {

  // Helper function
  const getOnlineUsers = () => {

    return Array.from(
      onlineUsers.entries()
    ).map(
      ([id, user]) => ({
        id,
        username: user.username,
      })
    );

  };

  // Socket Authentication Middleware
  io.use(async (socket, next) => {

    try {

      const token =
        socket.handshake.auth.token;

      if (!token) {
        return next(
          new Error(
            "Authentication error"
          )
        );
      }

      const decoded =
        jwt.verify(
          token,
          env.JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.id
        ).select("-password");

      if (!user) {
        return next(
          new Error(
            "User not found"
          )
        );
      }

      socket.user = user;

      next();

    } catch (error) {

      next(
        new Error(
          "Authentication failed"
        )
      );

    }

  });

  // Connection Event
  io.on(
    "connection",
    (socket) => {

      const userId =
        socket.user._id.toString();

      // User already online
      if (
        onlineUsers.has(userId)
      ) {

        onlineUsers
          .get(userId)
          .sockets
          .add(socket.id);

      }

      // First connection
      else {

        onlineUsers.set(
          userId,
          {
            username:
              socket.user.username,

            sockets:
              new Set([
                socket.id,
              ]),
          }
        );

      }

      console.log(
        `User Connected: ${socket.user.username}`
      );

      console.log(
        `Socket ID: ${socket.id}`
      );

      // Broadcast online users
      io.emit(
        "online_users",
        getOnlineUsers()
      );

      // Socket Modules
      roomSocket(
        io,
        socket
      );

      messageSocket(
        io,
        socket
      );

      directMessageSocket(
        io,
        socket
      );

      // Test Event
      socket.on(
        "ping",
        () => {

          console.log(
            `Ping from ${socket.user.username}`
          );

          socket.emit(
            "pong"
          );

        }
      );

      // Disconnect Event
      socket.on(
        "disconnect",
        () => {

          const user =
            onlineUsers.get(
              userId
            );

          if (user) {

            user.sockets.delete(
              socket.id
            );

            // Remove user only if no sockets remain
            if (
              user.sockets.size === 0
            ) {

              onlineUsers.delete(
                userId
              );

            }

          }

          // Broadcast updated online users
          io.emit(
            "online_users",
            getOnlineUsers()
          );

          console.log(
            `${socket.user.username} disconnected`
          );

        }
      );

    }
  );

};

export default socketHandler;