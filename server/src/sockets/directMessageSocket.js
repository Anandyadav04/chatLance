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

    }

  );

  socket.on("mark_dm_read", async ({ messageId }) => {
    try {
        await DirectMessage.findByIdAndUpdate(
        messageId,
        { isRead: true }
        );

        io.emit("dm_read", {
        messageId,
        });

    } catch (error) {
        console.error(error);
    }
    });

	socket.on("delete_dm", async ({ messageId }) => {
		try {
			await DirectMessage.findByIdAndUpdate(
			messageId,
			{
					isDeleted: true,
			}
			);

			io.emit("dm_deleted", {
			messageId,
			});

		} catch (error) {
				console.error(error);
		}
	});

	socket.on(
		"dm_typing",
		({ conversationId }) => {

			socket.to(conversationId).emit(
				"user_dm_typing",
				{
					username:
						socket.user.username,
				}
			);

		}
	);

	socket.on(
		"dm_stop_typing",
		({ conversationId }) => {

			socket.to(conversationId).emit(
				"user_dm_stop_typing"
			);

		}
	);

	socket.on(
		"join_conversation",
		(conversationId) => {

			socket.join(
				conversationId
			);

		}
	);
};

export default directMessageSocket;