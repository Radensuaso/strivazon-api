import express from "express";
import {
  readProducts,
  readProductsReviews,
  writeProductsReviews,
} from "../../lib/fs-tools.js";
import { productsReviewsValidation } from "./validation.js";
import { validationResult } from "express-validator";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import multer from "multer";

const productsReviewsRouter = express.Router();

productsReviewsRouter.get("/", async (req, res, next) => {
  try {
    const productsReviews = await readProductsReviews();

    res.send(productsReviews);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productsReviewsRouter.get("/:_id", async (req, res, next) => {
  try {
    const paramsID = req.params._id;
    const productsReviews = await readProductsReviews();
    const productReview = productsReviews.find((pR) => pR._id === paramsID);
    if (productReview) {
      res.send(productReview);
    } else {
      res.send(
        createHttpError(
          404,
          `The Product Review with the id: ${paramsID} was not found.`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsReviewsRouter.post(
  "/product/:_id",
  productsReviewsValidation,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const paramsId = req.params._id;
        const products = await readProducts();
        const product = products.find((p) => p._id === paramsId);
        if (product) {
          const reqBody = req.body;

          const productsReviews = await readProductsReviews();
          const newProductReview = {
            _id: uniqid(),
            comment: reqBody.comment,
            rate: reqBody.rate,
            productId: product._id,
            createdAt: new Date(),
          };
          productsReviews.push(newProductReview);
          await writeProductsReviews(productsReviews);

          res.status(201).send(newProductReview);
        } else {
          res.send(
            createHttpError(
              404,
              `The Product with the id: ${paramsID} was not found.`
            )
          );
        }
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

productsReviewsRouter.put(
  "/:_id",
  productsReviewsValidation,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const paramsID = req.params._id;
        const productsReviews = await readProductsReviews();
        const productReviewToUpdate = productsReviews.find(
          (pR) => pR._id === paramsID
        );

        const updatedProductReview = {
          ...productReviewToUpdate,
          ...req.body,
        };

        const remainingProductsReviews = productsReviews.filter(
          (pR) => pR._id !== paramsID
        );

        remainingProductsReviews.push(updatedProductReview);
        await writeProductsReviews(remainingProductsReviews);

        res.send(updatedProductReview);
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

productsReviewsRouter.delete("/:_id", async (req, res, next) => {
  try {
    const paramsID = req.params._id;
    const productsReviews = await readProductsReviews();
    const productReview = productsReviews.find((pR) => pR._id === paramsID);
    if (productReview) {
      const remainingProductsReviews = productsReviews.filter(
        (pR) => pR._id !== paramsID
      );

      await writeProductsReviews(remainingProductsReviews);

      res.send({
        message: `The Product Review with the id: ${productReview._id} was deleted`,
        blogPost: productReview,
      });
    } else {
      next(
        createHttpError(
          404,
          `The product review with the id: ${paramsID} was not found`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productsReviewsRouter;
