import DirectMessage from "../models/DirectMessage.js";
import Conversation from "../models/Conversation.js";
import onlineUsers from "../services/onlineUsers.js";

const directMessageSocket =
  (io, socket) => {

  socket.on(
    "send_dm",
    async ({
      conversationId,
      message,
    }) => {

      try {

        const newMessage =
          await DirectMessage.create({
            conversationId,
            sender:
              socket.user._id,
            message,
          });

        const populatedMessage =
          await DirectMessage
            .findById(
              newMessage._id
            )
            .populate(
              "sender",
              "username"
            );

        const conversation =
          await Conversation
            .findById(
              conversationId
            );

        const participants =
          conversation.participants;

        participants.forEach(
          (userId) => {

            const user =
              onlineUsers.get(
                userId.toString()
              );

            if (!user)
              return;

            user.sockets.forEach(
              (socketId) => {

                io.to(
                  socketId
                ).emit(
                  "receive_dm",
                  populatedMessage
                );

              }
            );

          }
        );

      } catch (error) {

        console.error(
          error
        );

      }
      console.log(
        "DM SENT"
        );

    }

  );

};

export default directMessageSocket;