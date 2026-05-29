import Message from "../models/Message.js";

const messageSocket = (io, socket) => {

  socket.on(
    "send_message",
    async (data) => {

      try {

        // Save message in DB
        const newMessage =
          await Message.create({
            roomId: data.roomId,
            sender: socket.user._id,
            message: data.message,
          });

        // Broadcast message
        io.to(data.roomId).emit(
          "receive_message",
          {
            _id: newMessage._id,
            user: socket.user.username,
            message: newMessage.message,
            roomId: newMessage.roomId,
            createdAt: newMessage.createdAt,
          }
        );

      } catch (error) {

        console.error(error);

      }
    }
  );

};

export default messageSocket;