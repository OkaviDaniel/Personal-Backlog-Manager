import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/product.js";
import Dropped from "../models/dropped.js";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import * as searchSiteController from "./search-site-controller.js";

const addProduct = async (req, res, next) => {
  // we need to use express validator to validate the request body.
  // if something is missing, then we can send an error as a respnose.
  // otherwise we got the input that we want.

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { reason, productId, type } = req.body;

  let existingProduct;
  try {
    existingProduct = await Product.findOne({ productSiteId: productId });
  } catch (err) {
    return next(
      new HttpError("Couldn't retrieve data from products collection", 500)
    );
  }

  let createdDropped;
  if (existingProduct) {
    createdDropped = new Dropped({
      product_id: existingProduct,
      reason,
    });

    try {
      await createdDropped.save();
    } catch (err) {
      return next(
        new HttpError(
          "Could not save the product in the dropped collection",
          500
        )
      );
    }
  } else {
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
      await createdProduct.save();
      createdDropped = new Dropped({
        product_id: createdProduct,
        reason,
      });
      await createdDropped.save();
    } catch (err) {
      return next(
        new HttpError(
          "Could not save the product in products/dropped collection",
          500
        )
      );
    }
  }

  res.status(201).json({ product: createdDropped.toObject({ getters: true }) });
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Dropped.find().populate("product_id").sort('product_id.title').exec();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a products in the dropped collection.",
      500
    );
    return next(error);
  }

  if (!products) {
    return next(
      new HttpError("Could not find a products in the dropped collection", 404)
    );
  }

  res.json({
    products: products.map((p) => p.toObject({ getters: true })),
  });
};

const removeProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const prod = Dropped.find({product_id: prodId});
  await prod.deleteOne();
  res.status(200).json({ message: "Deleted place." });

};

export { addProduct, getProducts, removeProduct };
