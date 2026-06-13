import exp from "express";
export const adminApp = exp.Router();
import { verifyToken } from "../middlewares/VerifyToken.js";
import { animalModel } from "../models/AnimalModel.js";
import { userModel } from "../models/UserModel.js";

adminApp.get("/animals", verifyToken("ADMIN"), async (req, res) => {
  const animalsList = await animalModel
    .find()
    .populate("rescuer", "email firstName lastName");
  return res.status(200).json({ message: "Animals list", payload: animalsList });
});

adminApp.put("/state", verifyToken("ADMIN"), async (req, res) => {
  let { mail, toBeActive } = req.body;

  if (typeof toBeActive === "string") {
    toBeActive = toBeActive === "true";
  }

  const userDoc = await userModel.findOne({ email: mail });
  if (!userDoc) return res.status(404).json({ message: "User not found" });

  if (userDoc.isUserActive === toBeActive)
    return res.status(200).json({ message: "User is already in same state" });

  userDoc.isUserActive = toBeActive;
  await userDoc.save();
  return res.status(200).json({ message: "User state updated" });
});

adminApp.get("/users-rescuers", verifyToken("ADMIN"), async (req, res) => {
  try {
    const usersAndRescuers = await userModel.find(
      { role: { $in: ["USER", "RESCUER"] } },
      { email: 1, role: 1, isUserActive: 1, firstName: 1 }
    );
    res.status(200).json({ message: "Users and Rescuers", payload: usersAndRescuers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
