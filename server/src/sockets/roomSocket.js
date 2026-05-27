const roomSocket = (io, socket) => {

  // Join Room
  socket.on("join_room", (roomId) => {

    socket.join(roomId);

    console.log(
      `${socket.user.username} joined room ${roomId}`
    );

    // Notify room
    io.to(roomId).emit(
      "user_joined",
      {
        message: `${socket.user.username} joined the room`,
      }
    );

  });

  // Leave Room
  socket.on("leave_room", (roomId) => {

    socket.leave(roomId);

    console.log(
      `${socket.user.username} left room ${roomId}`
    );

  });

};

export default roomSocket;