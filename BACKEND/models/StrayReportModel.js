import { Schema, model, Types } from "mongoose";

const strayReportSchema = new Schema(
  {
    reportedBy: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "Reporter ID is required"],
    },
    species: {
      type: String,
      enum: ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"],
      required: [true, "Species is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Open", "Claimed", "Resolved"],
      default: "Open",
    },
    claimedBy: {
      type: Types.ObjectId,
      ref: "user",
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  }
);

export const strayReportModel = model("strayreport", strayReportSchema);
