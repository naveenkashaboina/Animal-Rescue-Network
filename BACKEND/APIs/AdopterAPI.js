import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { animalModel } from "../models/AnimalModel.js";
import { strayReportModel } from "../models/StrayReportModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
export const adopterApp = exp.Router();

adopterApp.get("/animals", async (req, res) => {
  const animalsList = await animalModel
    .find({ isAnimalActive: true })
    .populate("rescuer", "firstName lastName email")
    .populate("adoptedBy", "firstName lastName")
    .populate("strayReportedBy", "firstName");
  res.status(200).json({ message: "animals", payload: animalsList });
});

adopterApp.put("/animals", verifyToken("USER"), async (req, res) => {
  const { animalId, message } = req.body;
  const userId = req.user?.id;
  const animalDocument = await animalModel
  .findOne({ _id: animalId, isAnimalActive: true });
  if (!animalDocument) return res.status(404).json({ message: "Animal not found" });
  if (animalDocument.status !== "Available")
  return res.status(400).json({ message: "This animal is not available for adoption" });

  const existingRequest = animalDocument.inquiries.find((inq) => {
  const inquiryUserId = inq.user?._id
    ? inq.user._id.toString()
    : inq.user?.toString();
  return inquiryUserId === userId.toString();
});

if (existingRequest?.status === "Approved") {
  return res.status(400).json({ message: "Your request has already been approved" });
}
if (existingRequest?.status === "Pending") {
  return res.status(400).json({ message: "You already have a pending request for this animal" });
}
  animalDocument.inquiries.push({ user: userId, message, status: "Pending" });
  await animalDocument.save();
  const populated = await animalModel
    .findById(animalId)
    .populate("inquiries.user", "email firstName")
    .populate("rescuer", "firstName lastName email")
    .populate("adoptedBy", "firstName lastName")
    .populate("strayReportedBy", "firstName");
  res.status(200).json({ message: "Adoption request sent", payload: populated });
});

adopterApp.get("/my-adopted", verifyToken("USER"), async (req, res) => {
  const userId = req.user?.id;
  const animals = await animalModel
    .find({ adoptedBy: userId })
    .populate("rescuer", "firstName lastName email")
    .sort({ updatedAt: -1 });
  res.status(200).json({ message: "Adopted animals", payload: animals });
});

adopterApp.post("/stray-report", verifyToken("USER"), upload.single("imageUrl"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const { species, location, description } = req.body;
    if (req.file) cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    const report = new strayReportModel({
      reportedBy: req.user?.id,
      species,
      location,
      description,
      imageUrl: cloudinaryResult?.secure_url,
    });
    await report.save();
    res.status(201).json({ message: "Stray report submitted" });
  } catch (err) {
    if (cloudinaryResult?.public_id) await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    next(err);
  }
});

adopterApp.get("/my-stray-reports", verifyToken("USER"), async (req, res) => {
  const reports = await strayReportModel
    .find({ reportedBy: req.user?.id })
    .populate("claimedBy", "firstName lastName email")
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "Your stray reports", payload: reports });
});
