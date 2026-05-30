import Room from "../models/Room.js";

export const createRoom = async (
  req,
  res
) => {
  try {

    const { name, description } =
      req.body;

    const room = await Room.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(room);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

export const getRooms = async (
  req,
  res
) => {
  try {

    const rooms =
      await Room.find();

    res.status(200).json(rooms);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};