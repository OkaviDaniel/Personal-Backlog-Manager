import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/product.js";
import HttpError from "../models/http-error.js";
import Current from "../models/current.js";
import { validationResult } from "express-validator";
import * as searchSiteController from "./search-site-controller.js";

const addProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { productId, type } = req.body;
  let existingProduct;
  try {
    existingProduct = await Product.findOne({ productSiteId: productId });
  } catch (err) {
    return next(
      new HttpError("Couldn't retrieve data from products collection", 500)
    );
  }

  let createdCurrent;
  if (existingProduct) {
    createdCurrent = new Current({
      product_id: existingProduct,
    });

    try {
      await createdCurrent.save();
    } catch (err) {
      return next(
        new HttpError(
          "Could not add the product to the current list, it already in the list.",
          500
        )
      );
    }
  } else {
    // getting info from the internet about the product
    let productInfo;
    try {
      productInfo = await searchSiteController.searchForProduct(
        productId,
        type
      );
    } catch (err) {
      return next(new HttpError(err.message, 502));
    }

    const createdProduct = new Product({
      ...productInfo,
      type,
      productSiteId: productId,
    });

    try {
      // I can't use transaction because it's a standalone db
      await createdProduct.save();
      createdCurrent = new Current({
        product_id: createdProduct,
      });
      await createdCurrent.save();
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("could not save the product in the collection", 500)
      );
    }
  }
  res.status(201).json({ product: createdCurrent.toObject({ getters: true }) });
};

const checkIfExistsOnOtherCollections = (productId) => {
  let exists;
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Current.find().populate("product_id").exec();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a products in the current collection.",
      500
    );
    return next(error);
  }

  if (!products) {
    return next(
      new HttpError("Could not find a products in the current collection", 404)
    );
  }

  res.json({
    products: products.map((p) => p.toObject({ getters: true })),
  });
};

const removeProduct = async (req, res, next) => {
  // console.log(req.params.productId);
  const productId = req.params.productId;
  // productId is the id of the product in the products collection
  const prod = Current.find({product_id: productId});
  // console.log(prod);
  await prod.deleteOne();
  res.status(200).json({ message: "Deleted place." });
};

export { addProduct, getProducts, removeProduct };
