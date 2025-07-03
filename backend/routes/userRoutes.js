import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { followUnfollowUser, myProfile, updatePassword, updateProfile, userFollowerandFollowingData, userProfile } from "../controllers/userController.js";
import uploadFile from "../middlewares/multer.js";
const router = express.Router();

router.get("/me",isAuth, myProfile);
router.get("/:id",isAuth,userProfile);
router.post("/:id",isAuth,updatePassword);
router.put("/:id",isAuth,uploadFile,updateProfile);
router.post("/follow/:id",isAuth,followUnfollowUser);
router.post("/followdata/:id",isAuth,userFollowerandFollowingData);

export default router;