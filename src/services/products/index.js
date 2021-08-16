import express from "express"
import {
  readProducts,
  writeProducts,
  saveProductPicture,
  readProductsReviews,
} from "../../lib/fs-tools.js"
import { productsValidation } from "./validation.js"
import { validationResult } from "express-validator"
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

productsRouter.get("/:_id", async (req, res, next) => {
  try {
    const paramsID = req.params._id
    const products = await readProducts()
    const product = products.find((p) => p._id === paramsID)
    if (product) {
      res.send(product)
    } else {
      res.send(
        createHttpError(
          404,
          `The Product with the id: ${paramsID} was not found.`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.get("/:_id/productsReviews", async (req, res, next) => {
  try {
    const paramsID = req.params._id
    const products = await readProducts()
    const product = products.find((p) => p._id === paramsID)
    if (product) {
      const productsReviews = await readProductsReviews()

      console.log(productsReviews)

      const particularProductReviews = productsReviews.filter(
        (p) => p.productId === paramsID
      )
      res.send(particularProductReviews)
    } else {
      res.send(
        createHttpError(
          404,
          `The Product with the id: ${paramsID} was not found.`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})

productsRouter.post("/", productsValidation, async (req, res, next) => {
  try {
    const errorList = validationResult(req)
    if (errorList.isEmpty()) {
      const products = await readProducts()
      const reqBody = req.body

      const newProduct = {
        _id: uniqid(),
        name: reqBody.name,
        description: reqBody.description,
        brand: reqBody.brand,
        imageUrl: "",
        price: reqBody.price,
        category: reqBody.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      products.push(newProduct)
      await writeProducts(products)

      res.status(201).send(newProduct)
    } else {
      next(createHttpError(400, { errorList }))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default productsRouter
