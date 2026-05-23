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

app.get("/", (req, res) => {
    res.send("Welcome to ChatLance")
});

export default app