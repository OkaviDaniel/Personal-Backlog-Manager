import express from "express";
import {
  addProduct,
  addProductToCurrent,
  addProductToBacklog,
  addProductToDropped,
  searchProduct,
} from "../controllers/products-controller.js";

import { check } from "express-validator";

import * as completedController from "../controllers/completed-controller.js";
import * as backlogController from "../controllers/backlog-controller.js";
import * as droppedController from "../controllers/dropped-controller.js";
import * as currentController from "../controllers/current-controller.js";

export const router = express.Router();



router.post("/", addProduct);
router.post(
  "/completed",
  [
    check("productId").not().isEmpty(),
    check("type").not().isEmpty(),
    check("rating", "The rating must be between zero to 10!")
      .isInt({ min: 0, max: 10 })
      .not()
      .isEmpty(),
  ],
  completedController.addProduct
);
router.post(
  "/current",
  [check("productId").not().isEmpty()],
  currentController.addProduct
);
router.post("/backlog", backlogController.addProduct);
router.post(
  "/dropped",
  [
    check("productId").not().isEmpty(),
    check("type").not().isEmpty(),
    check("reason").not().isEmpty(),
  ],
  droppedController.addProduct
);


router.get("/completed",completedController.getProducts);
router.get("/current",currentController.getProducts);
router.get("/backlog",backlogController.getProducts);
router.get("/dropped",droppedController.getProducts);
router.get("/search/:type/:productName", searchProduct);


router.delete("/current/:productId",currentController.removeProduct);
router.delete("/dropped/:productId",droppedController.removeProduct);
router.delete("/backlog/:productId",backlogController.removeProduct);