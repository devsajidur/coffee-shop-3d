import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
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
    status: { type: String, default: "Pending" }, // Pending, Processing, Shipped, Delivered
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);
export default Order;