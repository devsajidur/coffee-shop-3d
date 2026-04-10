import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    type: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

// যদি আগে থেকেই মডেল তৈরি করা থাকে তাহলে সেটি ব্যবহার করবে, নাহলে নতুন করে তৈরি করবে
const Product = models.Product || model("Product", ProductSchema);

export default Product;