import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieparser from "cookie-parser";
import env from "./config/env.js";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: env.CLIENT_URL,
        credentials: true
    })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieparser());

// 1. Generous global limit for general browsing
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per IP
    message: "Too many requests from this IP, please try again later."
});
// 2. Strict limit just for auth routes to prevent brute-force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Only 10 login/register attempts per 15 mins
    message: "Too many login attempts, please try again after 15 minutes."
});
app.use(globalLimiter);
app.use("/api/auth", authLimiter);

// local module import
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import DirectMessageRoutes from "./routes/directMessageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/direct-messages", DirectMessageRoutes );
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
    res.send("Welcome to ChatLance")
});

export default app