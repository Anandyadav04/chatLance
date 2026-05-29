import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
    try {
        const {roomId} = req.params;

        const messages = await Message.find({
            roomId,
        })
        .populate(
            "sender",
            "username email"
        )
        .sort({ createdAt: 1});
        
        res.status(200).json(messages);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error"
        });
        
    }
};