const messageSocket = (io, socket) => {

  // Listen for messages
  socket.on("send_message", (data) => {

    console.log(
      `${socket.user.username}: ${data.message}`
    );

    // Broadcast message to room
    io.to(data.roomId).emit(
      "receive_message",
      {
        user: socket.user.username,
        message: data.message,
        roomId: data.roomId,
        createdAt: new Date(),
      }
    );

  });

};

export default messageSocket;