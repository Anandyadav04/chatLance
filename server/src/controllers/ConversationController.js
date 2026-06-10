import Conversation from "../models/Conversation.js";

export const createConversation =
  async (req, res) => {

    try {

      const { userId } =
        req.body;

      const currentUserId =
        req.user._id;

			if (
			  currentUserId.toString() ===
				userId
				) {

				return res
						.status(400)
						.json({
						message:
								"Cannot create conversation with yourself",
						});

				}

      // Check existing conversation
      const existingConversation =
        await Conversation.findOne({
          participants: {
            $all: [
              currentUserId,
              userId,
            ],
          },
        });

      if (existingConversation) {

				const populatedConversation =
					await Conversation.findById(
						existingConversation._id
					).populate(
						"participants",
						"username email"
					);

				return res
					.status(200)
					.json(populatedConversation);

			}

      const conversation =
        await Conversation.create({
          participants: [
            currentUserId,
            userId,
          ],
        });

			const populatedConversation =
				await Conversation.findById(
					conversation._id
				).populate(
					"participants",
					"username email"
				);

			res
				.status(201)
				.json(populatedConversation);

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

export const getConversations =
  async (req, res) => {

    try {

      const conversations =
        await Conversation.find({
          participants:
            req.user._id,
        })
        .populate(
          "participants",
          "username email"
        );

      res
        .status(200)
        .json(
          conversations
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