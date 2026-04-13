import mongoose, { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Coupon = models.Coupon || model("Coupon", CouponSchema);
export default Coupon;
