import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieparser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(cookieparser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
});

app.use(limiter);

// local module import
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import DirectMessageRoutes from "./routes/directMessageRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/direct-messages", DirectMessageRoutes )


app.get("/", (req, res) => {
    res.send("Welcome to ChatLance")
});

export default app