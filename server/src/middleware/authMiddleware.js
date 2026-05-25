import jwt from "jsonwebtoken";

import User from "../models/User.js";

import env from "../config/env.js";

const protect = async (req, res, next) => {
  try {
    let token;

    // Step 1 — Check Authorization Header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Step 2 — Extract Token
      token = req.headers.authorization.split(" ")[1];

      // Step 3 — Verify Token
      const decoded = jwt.verify(token, env.JWT_SECRET);

      // Step 4 — Find User
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export default protect;