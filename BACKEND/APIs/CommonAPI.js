import exp from "express";
import { userModel } from "../models/UserModel.js";
import { hash, compare } from "bcryptjs";
import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
const { sign } = jwt;
export const commonApp = exp.Router();
config();

commonApp.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const allowedRoles = ["USER", "RESCUER"];
    const newUser = req.body;
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }
    newUser.profileImageUrl = cloudinaryResult?.secure_url;
    newUser.password = await hash(newUser.password, 12);
    const newUserDoc = new userModel(newUser);
    await newUserDoc.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err);
  }
});

commonApp.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email" });
  if (!user.isUserActive) return res.status(403).json({ message: "You are blocked" });
  const isMatched = await compare(password, user.password);
  if (!isMatched) return res.status(400).json({ message: "Invalid password" });
  const signedToken = sign(
    {
      id: user._id,email,
      role: user.role,firstName: user.firstName,lastName: user.lastName,profileImageUrl: user.profileImageUrl,
    },process.env.SECRET_KEY,{ expiresIn: "1h" }
  );
  let userObj = user.toObject();
  delete userObj.password;
  res.status(200).json({ message: "login success", payload: userObj, token: signedToken });
});

commonApp.get("/logout", (req, res) => {
  res.status(200).json({ message: "Logout success" });
});

commonApp.get("/check-auth", verifyToken("USER", "RESCUER", "ADMIN"), (req, res) => {
  res.status(200).json({ message: "authenticated", payload: req.user });
});

commonApp.put("/password", verifyToken("USER", "RESCUER", "ADMIN"), async (req, res) => {
  const { currentPwd, newPwd } = req.body;
  if (currentPwd === newPwd)
    return res.status(400).json({ message: "New password must differ from current password" });
  const currentUserEmail = req.user?.email;
  const currentUserDoc = await userModel.findOne({ email: currentUserEmail });
  const isMatched = await compare(currentPwd, currentUserDoc.password);
  if (!isMatched) {
    return res.status(400).json({ message: "Current password is not matched" });
  }
  let newHashedPwd = await hash(newPwd, 12);
  currentUserDoc.password = newHashedPwd;
  await currentUserDoc.save();
  res.status(200).json({ message: "Password changed successfully" });
});
