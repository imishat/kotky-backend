import { assert } from "console";

import mongoose from "mongoose";
import { ICategory } from "./Category.interface";
import { Category } from "./Category.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const createCategory = async (
  payload: ICategory
): Promise<ICategory | null> => {
  const result = await Category.create(payload);

  // if (!createdUser) {
  //   throw new ApiError(400, "Failed to create");
  // }
  return result;
};

const getSingleBySlug = async (slug: string): Promise<ICategory | null> => {
  const result = await Category.findOne({ slug }); // Query by the 'slug' field
  return result;
};
const getSingleById = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};
const getParent = async (id: string) => {
  const result = await Category.find({ parentCategoryId: id });
  return result;
};

export const updateCategoryId = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
  // Validate the ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  // Find and update the parent category
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true, // Enforce schema validations
  });

  return result;
};

const getAll = async () => {
  const result = await Category.find().sort({ createdAt: -1 });
  return result;
};
const deleteCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }
  const result = await Category.findByIdAndDelete({ _id: id });
  return result;
};

export const CategoryService = {
  createCategory,
  getSingleBySlug,
  getSingleById,
  updateCategoryId,
  getAll,
  deleteCategoryFromDB,
  getParent,
};
