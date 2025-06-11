import mongoose from "mongoose";

const DemoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    graduationYear: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const DemoSession =
  mongoose.models.DemoSession || mongoose.model("DemoSession", DemoSchema);
