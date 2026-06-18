import { Schema, model, Types } from "mongoose";

const inquirySchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: [true, "User ID required"],
  },
  message: {
    type: String,
    required: [true, "Enter a message"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const animalSchema = new Schema(
  {
    rescuer: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "Rescuer ID is required"],
    },
    name: {
      type: String,
      required: [true, "Animal name is required"],
    },
    species: {
      type: String,
      enum: ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"],
      required: [true, "Species is required"],
    },
    breed: {
      type: String,
    },
    age: {
      type: String,
      required: [true, "Age is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    address: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Available", "Adopted", "In Care"],
      default: "Available",
    },
    adoptedBy: {
      type: Types.ObjectId,
      ref: "user",
      default: null,
    },
    fromStray: {
      type: Boolean,
      default: false,
    },
    strayReportedBy: {
      type: Types.ObjectId,
      ref: "user",
      default: null,
    },
    inquiries: [{ type: inquirySchema, default: [] }],
    isAnimalActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  }
);

export const animalModel = model("animal", animalSchema);
