import DirectMessage
from "../models/DirectMessage.js";

export const sendDirectMessage =
  async (req, res) => {

    try {

      const {
        conversationId,
        message,
      } = req.body;

      const newMessage =
        await DirectMessage.create({
          conversationId,
          sender:
            req.user._id,
          message,
        });

      const populatedMessage =
        await DirectMessage
          .findById(
            newMessage._id
          )
          .populate(
            "sender",
            "username email"
          );

      res
        .status(201)
        .json(
          populatedMessage
        );

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .json({
          message:
            "Server Error",
        });

    }

};

export const getDirectMessages =
  async (req, res) => {

    try {

      const messages =
        await DirectMessage
          .find({
            conversationId:
              req.params.id,
          })
          .populate(
            "sender",
            "username email"
          )
          .sort({
            createdAt: 1,
          });

      res
        .status(200)
        .json(
          messages
        );

    } catch (error) {

      console.error(error);

      res
        .status(500)
        .json({
          message:
            "Server Error",
        });

    }

};