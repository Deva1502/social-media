import {User} from "../Models/userModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;
    const file = req.file;
    if (!name || !email || !password || !gender || !file) {
      if(!name){
        return res.status(400).json({ message: "Name is required" });
      }
      if(!email){
        return res.status(400).json({ message: "Email is required" });
      }
      if(!password){
        return res.status(400).json({ message: "Password is required" });
      }
      if(!gender){
        return res.status(400).json({ message: "Gender is required" });
      }
      if(!file){
        return res.status(400).json({ message: "Profile picture is required" });
      }
      
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // const fileUrl = getDataUrl(file);
    const hashPassword = await bcrypt.hash(password, 10);

    // const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    user = await User.create({
      name,
      email,
      password: hashPassword,
      gender,
      ProfilePic: {
        // id: myCloud.public_id,
        // url: myCloud.secure_url,
      },
    });
    generateToken(user._id, res);
    res.status(201).json({
      message: "User created successfully", 
      user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = TryCatch(async (req, res) => {
  const {email,password} = req.body;

  const user = await User.findOne({email});

  if(!user){
    return res.status(400).json({message:"User not found"});
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    return res.status(400).json({message:"Invalid credentials"});
  } 

  generateToken(user._id,res);
  res.status(200).json(
    {message : "Login successful",
    user});
})

export const logoutUser = TryCatch(
   (req, res) => {
    res.cookie("token","",{maxAge:0});
    res.status(200).json({ message: "Logout successful" });
  }
)
