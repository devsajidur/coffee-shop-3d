import mongoose, { Schema, model, models } from "mongoose";

export const KITCHEN_STATUSES = [
  "Pending",
  "Preparing",
  "Ready",
  "Served",
] as const;
export type KitchenStatus = (typeof KITCHEN_STATUSES)[number];

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    tableNumber: { type: String, default: "" },
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    peopleCount: { type: Number, default: 1 },
    items: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    subTotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "cod" },
    /** Legacy fulfillment flag */
    status: { type: String, default: "Pending" },
    /** Kitchen / floor workflow */
    kitchenStatus: {
      type: String,
      enum: KITCHEN_STATUSES,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;
