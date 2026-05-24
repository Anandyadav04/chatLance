import mongoose from "mongoose";
import env from "./env.js";

const connectDB = async() => {
    try{
       const conn = await mongoose.connect(env.MONGO_URI);

       console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Failed:", error.message);

        process.exit(1);
    }
};

export default connectDB;