import jwt from "jsonwebtoken";
import {User} from "../Models/userModel.js";
export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "You havent Login" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(400).json({ message: "token expired" });
        }
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: "You havent Login" });
    }
}