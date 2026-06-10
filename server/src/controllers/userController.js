import User from "../models/User.js";

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q || "";

    const users = await User.find({
      username: {
        $regex: query,
        $options: "i",
      },
      _id: {
        $ne: req.user._id,
      },
    })
      .select("_id username email")
      .limit(10);

    res.status(200).json(users);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};