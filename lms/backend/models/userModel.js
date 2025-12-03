import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 3,
    },

    role: {
      type: String,
      enum: ["admin", "manager", "agent"],
      default: "agent",
    },
    // NEW FIELD
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
