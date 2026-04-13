import mongoose, { Schema, model, models } from "mongoose";

const StaffSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, default: "" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Staff = models.Staff || model("Staff", StaffSchema);
export default Staff;
