import mongoose from "mongoose";

const specItemSchema = new mongoose.Schema(
  {
    spec_name: { type: String },
    detail: { type: String },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock_quantity: {
      type: Number,
      required: true,
    },
    spec: [specItemSchema],
    image: [String], 
    created_at: {
      type: Date,
      default: Date.now,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;