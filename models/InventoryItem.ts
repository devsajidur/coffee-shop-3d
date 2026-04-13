import mongoose, { Schema, model, models } from "mongoose";

const InventoryItemSchema = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    unit: { type: String, default: "kg" },
    currentStock: { type: Number, required: true, default: 0 },
    capacity: { type: Number, required: true, default: 100 },
  },
  { timestamps: true }
);

const InventoryItem =
  models.InventoryItem || model("InventoryItem", InventoryItemSchema);
export default InventoryItem;
