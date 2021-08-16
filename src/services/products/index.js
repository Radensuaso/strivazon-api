import express from "express"
import {
  readProducts,
  writeProducts,
  saveProductPicture,
  readProductsReviews,
} from "../../lib/fs-tools.js"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import multer from "multer"

const productsRouter = express.Router()

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await readProducts()
    console.log(products)

    if (req.query && req.query.category) {
      const filteredProducts = products.filter((product) =>
        product.category
          .toLocaleLowerCase()
          .includes(req.query.category.toLocaleLowerCase())
      )
      res.send(filteredProducts)
    } else {
      res.send(products)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default productsRouter
