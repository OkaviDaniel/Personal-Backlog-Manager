import fs from "fs";
import mongoose from "mongoose";
import Product from "../models/product.js";
import Completed from "../models/completed.js";
import HttpError from "../models/http-error.js";
import { validationResult } from "express-validator";
import * as productsController from "./products-controller.js";
import * as searchSiteController from "./search-site-controller.js";

const addProduct = async (req, res, next) => {
  // first validate the user's input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  // taking the info from the req.body using destructuring
  const { productId, type, rating } = req.body;

  let existingProduct; // an object that will check if we have the product in the products collection
  try {
    existingProduct = await Product.findOne({ productSiteId: productId });
  } catch (err) {
    const error = new HttpError(
      "Searching for product failed, please try again later.",
      500
    );
    return next(error);
  }

  // if it exists, then just add to the completed collection
  if (existingProduct) {
    // create completed object of type Model
    const createdCompleted = new Completed({
      product_id: existingProduct.id,
      rating,
    });

    try {
      await createdCompleted.save();
    } catch (err) {
      // console.log(err);
      return next(
        new HttpError("Could not save the product in the Completed list", 500)
      );
    }
    res
      .status(201)
      .json({ product: createdCompleted.toObject({ getters: true }) });
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

    // console.log(productInfo);

    // after that we need to add the product to the products collection and then to the completed collection
    let result;
    try {
      result = await productsController.createProduct({
        ...productInfo,
        type,
        productSiteId: productId,
      });
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("Couldn't add the product to the products list")
      );
    }

    // console.log(result.id);
    // now we need to add it to the Completed collection
    const createdCompleted = new Completed({
      product_id: result,
      rating,
    });

    try {
      await createdCompleted.save();
    } catch (err) {
      console.log(err);
      return next(
        new HttpError("Could not store the product in completed", 500)
      );
    }

    // console.log(createdCompleted.product_id.title); // it working! we can access all the fields of the document
    res
      .status(201)
      .json({ product: createdCompleted.toObject({ getters: true }) });
  }
};

const getProducts = async (req, res, next) => {
  let products;
  try {
    products = await Completed.find()
      .populate({
        path: "product_id",
        options: { sort: { title: 1 } }, // Sort options for the populated field
      })
      .exec();
    // console.log(products);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a products in the completed collection.",
      500
    );
    return next(error);
  }

  if (!products) {
    return next(
      new HttpError(
        "Could not find a products in the completed collection",
        404
      )
    );
  }

  res.json({
    products: products.map((p) => p.toObject({ getters: true })),
  });
};

export { addProduct, getProducts };
