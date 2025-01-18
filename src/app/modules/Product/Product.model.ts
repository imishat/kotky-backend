import mongoose, { Schema } from "mongoose";
import { IProduct, ProductModel } from "./Product.interface";
import slugify from "slugify";

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: false },
    name: { type: String, required: true },
    price: [
      {
        weight: { type: String, required: true },
        price: { type: String, required: true },
        availableQuantity: { type: Number, required: true },
      },
    ],

    discountedPrice: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: false },
    onSale: { type: Boolean, required: true, default: false },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    imageDefault: { type: String, required: true },
    imageHover: { type: String, required: true },
    additionalDetails: [
      {
        color: { type: String },
        hex: { type: String },
        quantity: { type: Number, required: true },
        images: [{ type: String, required: true }],
      },
    ],
  },
  { timestamps: true }
);
// Pre-save middleware to set the `id` field
ProductSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

ProductSchema.pre("save", async function (next) {
  if (this.isModified("name") || this.isNew) {
    // Generate base slug
    const baseSlug = slugify(this.name, {
      lower: true, // Convert to lowercase
      strict: true, // Remove special characters
      replacement: "-", // Replace spaces with hyphens
    });

    let uniqueSlug = baseSlug;
    let counter = 0;

    // Check for slug uniqueness
    while (
      await Product.findOne({ slug: uniqueSlug }) // Correct model name
    ) {
      counter += 1;
      uniqueSlug = `${baseSlug}-${counter}`; // Append counter if duplicate
    }

    this.slug = uniqueSlug; // Set the unique slug
  }
  next();
});

// Transform output to include `id` and remove `_id` and `__v`
ProductSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export const Product = mongoose.model<IProduct, ProductModel>(
  "Product",
  ProductSchema
);
