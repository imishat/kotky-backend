import mongoose, { Schema } from "mongoose";
import { ICategory, CategoryModel } from "./Category.interface";
import slugify from "slugify";

// Define Mongoose schema
const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, unique: true }, // Derived from `_id`
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

// Pre-save middleware to set the `id` field
CategorySchema.pre("save", function (next) {
  if (!this.id) {
    this.id = this._id.toString();
  }
  next();
});

CategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

CategorySchema.pre("save", async function (next) {
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
      await Category.findOne({ slug: uniqueSlug }) // Correct model name
    ) {
      counter += 1;
      uniqueSlug = `${baseSlug}-${counter}`; // Append counter if duplicate
    }

    this.slug = uniqueSlug; // Set the unique slug
  }
  next();
});

// Transform output to include `id` and remove `_id` and `__v`
CategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

// Create and export the model
export const Category = mongoose.model<ICategory, CategoryModel>(
  "Category",
  CategorySchema
);
