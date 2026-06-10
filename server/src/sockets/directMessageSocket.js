import DirectMessage from "../models/DirectMessage.js";
import Conversation from "../models/Conversation.js";
import onlineUsers from "../services/onlineUsers.js";

const directMessageSocket = (io, socket) => {

  socket.on("send_dm", async ({ conversationId, message }) => {
    try {
      const newMessage = await DirectMessage.create({
        conversationId,
        sender: socket.user._id,
        message,
      });

      const populatedMessage = await DirectMessage
        .findById(newMessage._id)
        .populate("sender", "_id username");

      // Add conversationId to the message being sent
      const messageToSend = populatedMessage.toObject();
      messageToSend.conversationId = conversationId;

      const conversation = await Conversation.findById(conversationId);
      const participants = conversation.participants;

      participants.forEach((userId) => {
        const user = onlineUsers.get(userId.toString());
        if (!user) return;

        user.sockets.forEach((socketId) => {
          io.to(socketId).emit("receive_dm", messageToSend);
        });
      });

    } catch (error) {
      console.error(error);
    }
  });

  socket.on("mark_dm_read", async ({ messageId, conversationId }) => {
    console.log("DM READ EVENT", messageId, conversationId);
    try {
      await DirectMessage.findByIdAndUpdate(messageId, { isRead: true });
      
			io.to(conversationId).emit(
				"dm_read",
				{
					messageId,
					conversationId,
				}
			);
      
      // Emit unread count update
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        for (const participantId of conversation.participants) {
          const unreadCount = await DirectMessage.countDocuments({
            conversationId,
            isRead: false,
            sender: { $ne: participantId }
          });
          
          const user = onlineUsers.get(participantId.toString());
          if (user) {
            user.sockets.forEach((socketId) => {
              io.to(socketId).emit("unread_count_update", {
                conversationId,
                unreadCount
              });
            });
          }
        }
      }
      
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("delete_dm", async ({ messageId, conversationId }) => {
    try {
      const message = await DirectMessage.findById(messageId);
      if (!message) return;

      if (message.sender.toString() !== socket.user._id.toString()) {
        return;
      }

      message.isDeleted = true;
      await message.save();

      io.emit("dm_deleted", {
        messageId,
        conversationId,
      });

    } catch (error) {
      console.error(error);
    }
  });

  socket.on("dm_typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user_dm_typing", {
      username: socket.user.username,
    });
  });

  socket.on("dm_stop_typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user_dm_stop_typing");
  });

  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });
};

export default directMessageSocket;