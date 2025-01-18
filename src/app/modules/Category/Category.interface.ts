import mongoose, { Model } from "mongoose";

export type ICategory = {
  id: string;
  name: string; // Required: Name of the category
  image: string;
  slug?: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
