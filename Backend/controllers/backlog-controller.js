import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/product.js";
import HttpError from "../models/http-error.js";
import Backlog from "../models/backlog.js";
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

  let createdBacklog;
  if (existingProduct) {
    createdBacklog = new Backlog({
      product_id: existingProduct,
    });

    try {
      await createdBacklog.save();
    } catch (err) {
      return next(
        new HttpError(
          "Could not save the product on the Backlog collection",
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
      await createdProduct.save();
      createdBacklog = new Backlog({
        product_id: createdProduct,
      });
      await createdBacklog.save();
    } catch (err) {
      return next(
        new HttpError(
          "Could not save the product in the products or in the backlog collection",
          500
        )
      );
    }
  }
  res.status(201).json({ product: createdBacklog.toObject({ getters: true }) });
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Backlog.find().populate("product_id").exec();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a products in the backlog collection.",
      500
    );
    return next(error);
  }

  if (!products) {
    return next(
      new HttpError("Could not find a products in the backlog collection", 404)
    );
  }

  res.json({
    products: products.map((p) => p.toObject({ getters: true })),
  });
};

const removeProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const prod = Backlog.find({product_id: prodId});
  await prod.deleteOne();
  res.status(200).json({ message: "Deleted place." });
};

export { addProduct, getProducts, removeProduct};
