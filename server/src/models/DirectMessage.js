import mongoose from "mongoose";

const directMessageSchema =
  new mongoose.Schema(
    {
      conversationId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "Conversation",

        required: true,
      },

      sender: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      message: {
        type: String,

        required: true,
      },

      isRead: {
        type: Boolean,

        default: false,
      },

      isDeleted: {
        type: Boolean,
        default: false,
        },
    },
    {
      timestamps: true,
    }
  );

const DirectMessage =
  mongoose.model(
    "DirectMessage",
    directMessageSchema
  );

export default DirectMessage;