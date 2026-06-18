import exp from "express";
import { animalModel } from "../models/AnimalModel.js";
import { strayReportModel } from "../models/StrayReportModel.js";
import { verifyToken } from "../middlewares/VerifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
export const rescuerApp = exp.Router();

rescuerApp.post("/animal", verifyToken("RESCUER"), upload.single("imageUrl"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const { name, species, breed, age, description, status, address } = req.body;
    const rescuerId = req.user.id;
    if (req.file) cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    const animalDoc = new animalModel({
      rescuer: rescuerId,
      name,
      species,
      breed: breed || undefined,
      age,
      description,
      address: address || undefined,
      status: status || "Available",
      imageUrl: cloudinaryResult?.secure_url || undefined,
    });
    await animalDoc.save();
    res.status(201).json({ message: "Animal posted successfully" });
  } catch (err) {
    if (cloudinaryResult?.public_id) await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    next(err);
  }
});

rescuerApp.get("/animals", verifyToken("RESCUER"), async (req, res) => {
  const rescuerIdOfToken = req.user?.id;
  const animalsList = await animalModel
    .find({ rescuer: rescuerIdOfToken })
    .populate("adoptedBy", "firstName lastName email");
  res.status(200).json({ message: "animals", payload: animalsList });
});

rescuerApp.put("/animals", verifyToken("RESCUER"), async (req, res) => {
  const rescuerIdOfToken = req.user?.id;
  const { animalId, name, species, breed, age, description, status, address } = req.body;
  const modifiedAnimal = await animalModel.findOneAndUpdate(
    { _id: animalId, rescuer: rescuerIdOfToken },
    { $set: { name, species, breed, age, description, status, address } },
    { new: true }
  );
  if (!modifiedAnimal) return res.status(403).json({ message: "Not authorized to edit this animal" });
  res.status(200).json({ message: "Animal updated", payload: modifiedAnimal });
});

rescuerApp.patch("/animals", verifyToken("RESCUER"), async (req, res) => {
  const rescuerIdOfToken = req.user?.id;
  const { animalId, isAnimalActive } = req.body;
  const animalOfDB = await animalModel.findOne({ _id: animalId, rescuer: rescuerIdOfToken });
  if (!animalOfDB) return res.status(404).json({ message: "Animal not found" });
  if (isAnimalActive === animalOfDB.isAnimalActive)
    return res.status(200).json({ message: "Animal already in the same state" });
  animalOfDB.isAnimalActive = isAnimalActive;
  await animalOfDB.save();
  res.status(200).json({ message: "Animal updated", payload: animalOfDB });
});

rescuerApp.get("/animal/:id/requests", verifyToken("RESCUER"), async (req, res) => {
  const rescuerIdOfToken = req.user?.id;
  const animal = await animalModel
    .findOne({ _id: req.params.id, rescuer: rescuerIdOfToken })
    .populate("inquiries.user", "firstName lastName email profileImageUrl")
    .populate("adoptedBy", "firstName lastName email")
    .populate("strayReportedBy", "firstName email");
  if (!animal) return res.status(404).json({ message: "Animal not found" });
  res.status(200).json({ message: "Requests", payload: animal });
});

rescuerApp.put("/inquiry/approve", verifyToken("RESCUER"), async (req, res) => {
  const { animalId, inquiryId } = req.body;
  const rescuerIdOfToken = req.user?.id;
  const animal = await animalModel.findOne({ _id: animalId, rescuer: rescuerIdOfToken });
  if (!animal) return res.status(404).json({ message: "Animal not found" });
  const inquiry = animal.inquiries.id(inquiryId);
  if (!inquiry) return res.status(404).json({ message: "Request not found" });
  animal.inquiries.forEach((inq) => { inq.status = "Rejected"; });
  inquiry.status = "Approved";
  animal.status = "Adopted";
  animal.adoptedBy = inquiry.user;
  await animal.save();
  const populated = await animalModel
    .findById(animalId)
    .populate("inquiries.user", "firstName email")
    .populate("adoptedBy", "firstName lastName email")
    .populate("rescuer", "firstName lastName email")
    .populate("strayReportedBy", "firstName email");
  res.status(200).json({ message: "Adoption approved", payload: populated });
});

rescuerApp.put("/inquiry/reject", verifyToken("RESCUER"), async (req, res) => {
  const { animalId, inquiryId } = req.body;
  const rescuerIdOfToken = req.user?.id;
  const animal = await animalModel.findOne({ _id: animalId, rescuer: rescuerIdOfToken });
  if (!animal) return res.status(404).json({ message: "Animal not found" });
  const inquiry = animal.inquiries.id(inquiryId);
  if (!inquiry) return res.status(404).json({ message: "Request not found" });
  inquiry.status = "Rejected";
  await animal.save();
  res.status(200).json({ message: "Request rejected" });
});

rescuerApp.get("/stray-reports", verifyToken("RESCUER"), async (req, res) => {
  const reports = await strayReportModel
    .find({ status: { $in: ["Open", "Claimed"] } })
    .populate("reportedBy", "firstName email")
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "Stray reports", payload: reports });
});

rescuerApp.put("/stray-reports/claim", verifyToken("RESCUER"), async (req, res) => {
  const { reportId } = req.body;
  const rescuerId = req.user?.id;
  const report = await strayReportModel.findById(reportId);
  if (!report) return res.status(404).json({ message: "Report not found" });
  if (report.status !== "Open") return res.status(400).json({ message: "Report already claimed" });
  report.status = "Claimed";
  report.claimedBy = rescuerId;
  await report.save();
  res.status(200).json({ message: "Report claimed", payload: report });
});

rescuerApp.post("/stray-reports/convert", verifyToken("RESCUER"), async (req, res, next) => {
  try {
    const { reportId, name, breed, age, description, address } = req.body;
    const rescuerId = req.user?.id;
    const report = await strayReportModel
      .findOne({ _id: reportId, claimedBy: rescuerId })
      .populate("reportedBy", "_id");
    if (!report) return res.status(404).json({ message: "Report not found or not claimed by you" });
    const newAnimal = new animalModel({
      rescuer: rescuerId,
      name,
      species: report.species,
      breed: breed || undefined,
      age,
      description,
      address: address || report.location,
      imageUrl: report.imageUrl || undefined,
      status: "In Care",
      fromStray: true,
      strayReportedBy: report.reportedBy?._id || report.reportedBy,
    });
    await newAnimal.save();
    report.status = "Resolved";
    await report.save();
    res.status(201).json({ message: "Animal added to In Care listings", payload: newAnimal });
  } catch (err) {
    next(err);
  }
});
