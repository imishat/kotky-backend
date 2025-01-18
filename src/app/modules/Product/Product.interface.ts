import mongoose, { Model, Types } from "mongoose";

type Price = {
  weight: string;
  price: number;
  availableQuantity: number;
};
type AdditionalDetails = {
  color?: string;
  hex?: string;
  quantity: number;
  images: string[];
};
type Size = {
  [key: string]: string;
};

export type IProduct = {
  _id: mongoose.Types.ObjectId;

  slug?: string;
  name: string;
  price: Price;

  discountedPrice: number;
  inStock: boolean;
  onSale: boolean;
  categoryId: mongoose.Types.ObjectId;

  imageDefault: string;
  imageHover: string;
  additionalDetails: AdditionalDetails;
};

export type IProductFilters = {
  searchTerm?: string;
  category?: string;
  categoryId?: Types.ObjectId;
};
export type ProductModel = Model<IProduct, Record<string, unknown>>;
