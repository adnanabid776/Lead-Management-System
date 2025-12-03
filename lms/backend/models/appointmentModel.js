import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: { type: Date, required: true },
    mode: { type: String,enum: ["call", "sms", "email","online meeting"], default: "call" },
    notes: { type: String },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled"
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // creator name/email string
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
