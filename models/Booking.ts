import mongoose, { Schema, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: String, required: true },
    status: { type: String, default: "Confirmed" },
  },
  { timestamps: true }
);

const Booking = models.Booking || model("Booking", BookingSchema);
export default Booking;