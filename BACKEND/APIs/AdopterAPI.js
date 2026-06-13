import exp from "express";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { animalModel } from "../models/AnimalModel.js";
import { strayReportModel } from "../models/StrayReportModel.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
export const adopterApp = exp.Router();

adopterApp.get("/animals", async (req, res) => {
  const animalsList = await animalModel.find({ isAnimalActive: true });
  res.status(200).json({ message: "animals", payload: animalsList });
});

adopterApp.put("/animals", verifyToken("USER"), async (req, res) => {
  const { animalId, message } = req.body;
  const userId = req.user?.id;

  const animalDocument = await animalModel
    .findOne({ _id: animalId, isAnimalActive: true })
    .populate("inquiries.user", "email firstName");

  if (!animalDocument) {
    return res.status(404).json({ message: "Animal not found" });
  }

  if (animalDocument.status !== "Available") {
    return res.status(400).json({ message: "This animal is not available for adoption" });
  }

  const alreadyRequested = animalDocument.inquiries.some(
    (inq) => inq.user?._id?.toString() === userId || inq.user?.toString() === userId
  );
  if (alreadyRequested) {
    return res.status(400).json({ message: "You have already sent a request for this animal" });
  }

  animalDocument.inquiries.push({ user: userId, message, status: "Pending" });
  await animalDocument.save();

  const populated = await animalModel
    .findById(animalId)
    .populate("inquiries.user", "email firstName");

  res.status(200).json({ message: "Adoption request sent", payload: populated });
});

adopterApp.post("/stray-report", verifyToken("USER"), upload.single("imageUrl"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const { species, location, description } = req.body;
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }
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
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err);
  }
});

adopterApp.get("/my-stray-reports", verifyToken("USER"), async (req, res) => {
  const reports = await strayReportModel.find({ reportedBy: req.user?.id }).sort({ createdAt: -1 });
  res.status(200).json({ message: "Your stray reports", payload: reports });
});
