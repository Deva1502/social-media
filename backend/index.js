import express from "express"
const app = express()
import cloudinary from "cloudinary"
import cookieParser from "cookie-parser"

import dotenv from "dotenv"
import { connectDB } from "./database/db.js";
dotenv.config() // we are doing so that we can access evv file

//connecting coloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINIARY_CLOUD_NAME,
    api_key: process.env.CLOUDINIARY_API,
    api_secret: process.env.CLOUDINIARY_SECRET
})

//using middleware
app.use(express.json())
app.use(cookieParser())

//importing routes
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoute.js"
import postRoutes from "./routes/postRoutes.js"
import messageRoutes from "./routes/messageRoute.js"
import { isAuth } from "./middlewares/isAuth.js"
import chatModel from "./Models/chatModel.js"

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages", messageRoutes);

app.get("/chats",isAuth,async (req,res)=>{
    try {
        const chats = await chatModel.find({
            users:req.user._id,
        }).populate({
            path:"users",
            select:"name profilePic",
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
const  PORT =process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})