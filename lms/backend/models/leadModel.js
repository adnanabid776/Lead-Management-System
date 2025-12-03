import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String },
    source: { type: String }, // website, referral etc
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "won", "lost"],
      default: "new",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // stores user name (manager / agent)
    notes: { type: String },
    createdBy: { type: String }, // creator name/email string
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
