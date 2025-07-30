import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { getAllMessages, sendMessage } from "../controllers/messageController.js";
const router = express.Router();


router.post("/",isAuth,sendMessage)
router.post("/:id",isAuth,getAllMessages)

export default router;