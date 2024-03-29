import mongoose from "mongoose";

const { Schema } = mongoose;

let productSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  website: { type: String, required: true },
  type: { type: String, required: true },
  productSiteId: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
});

productSchema.index({ title: 1, productSiteId: 1 }, { unique: true });

// now we create the model out of the Schema

const Product = mongoose.model("Product", productSchema);

export default Product;
