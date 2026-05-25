import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken({
      id: user._id,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            })
        }

        // find user
        const user = await User.findOne({email});
        
        // check user exists
        if(!user) {
            return res.status(400).json({
                Message: "Invalid Credentials",
            });
        }

        // comapre password
        const isMatch = await user.comparePassword(password)

        if(!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken({
            id: user._id,
        });

        // send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
        message: "Server Error",
    });
    }

}

export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};