import mongoose, { Schema, model, models } from "mongoose";

const RawMaterialSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    stockLevel: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, required: true, default: "kg" },
  },
  { timestamps: true }
);

const RawMaterial =
  models.RawMaterial || model("RawMaterial", RawMaterialSchema);
export default RawMaterial;
