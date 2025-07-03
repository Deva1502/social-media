import TryCatch from "../utils/TryCatch.js";
import { User } from "../Models/userModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

export const followUnfollowUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user._id.toString() === loggedInUser._id.toString())
    return res.status(400).json({ message: "You can't follow yourself" });
  if (user.followers.includes(loggedInUser._id)) {
    const indexfollowing = loggedInUser.followings.indexOf(user._id);
    const indexfollowers = user.followers.indexOf(loggedInUser._id);

    loggedInUser.followings.splice(indexfollowing, 1);
    user.followers.splice(indexfollowers, 1);

    await loggedInUser.save();
    await user.save();

    res.status(200).json({ message: "Unfollow successful" });
  } else {
    loggedInUser.followings.push(user._id);
    user.followers.push(loggedInUser._id);
    await loggedInUser.save();
    await user.save();
    res.status(200).json({ message: "Follow successful" });
  }
});

export const userFollowerandFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers","-password")
    .populate("followings","-password");
    const followers = user.followers;
    const followings = user.followings;

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(
    {
      followers,
      followings
    }
  );
});


export const updateProfile = TryCatch(
  async (req, res) => {
    const { name } = req.body;
    const user = await User.findById(req.user._id);
    if(name)
    user.name = name;

    const file = req.file;
    if(file){
      const fileUrl = getDataUrl(file);
      await cloudinary.v2.uploader.destroy(user.profilePic.id);
      const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
      user.profilePic = myCloud.public_id;
      user.profilePic.url = myCloud.secure_url;
    }
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  }
)


export const updatePassword = TryCatch(
  async (req, res) => {
    const user = await User.findById(req.user._id);
    const {oldPassword,newPassword} = req.body;
    const isMatch = await bcrypt.compare(oldPassword,user.password);
    if(!isMatch){
      return res.status(400).json({message:"Old password is incorrect"});
    }
    user.password = await bcrypt.hash(newPassword,10);
    await user.save();
    res.status(200).json({message:"Password updated successfully"});
  }
) 