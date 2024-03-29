import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/product.js";
import HttpError from "../models/http-error.js";
import * as searchSiteController from "./search-site-controller.js";

const createProduct = async (productInfo) => {
  const { title, image, website, type, productSiteId, platform } = productInfo;

  const createdProduct = new Product({
    title,
    image,
    website,
    type,
    productSiteId,
    platform,
  });

  try {
    await createdProduct.save();
  } catch (err) {
    throw new HttpError(err.message, 500);
  }
  return createdProduct;
};

const addProduct = async (req, res, next) => {
  console.log(req.body); // product id, type, status
  console.log(req.params.status);
};

const addProductToCompleted = async (req, res, next) => {};

const addProductToCurrent = async (req, res, next) => {};

const addProductToBacklog = async (req, res, next) => {};

const addProductToDropped = async (req, res, next) => {};

const searchProduct = async (req, res, next) => {
  const productId = req.params.productName;
  const type = req.params.type;
  let products;
  try{
    products = await searchSiteController.searchForProductByName(
      productId,
      type
    );
  }catch(err){
    return next(new HttpError(err.message, 500));
  }
  res.status(200).json({products: products});
};

export {
  createProduct,
  addProduct,
  addProductToCompleted,
  addProductToCurrent,
  addProductToBacklog,
  addProductToDropped,
  searchProduct,
};
