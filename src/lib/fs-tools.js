import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, remove } = fs;

const productsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/products.json"
);
const productsPicturesFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/productsPictures"
);
const productsReviewsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/productsReviews.json"
);

// *************** Products ****************
export const readProducts = () => readJSON(productsJSONPath);
export const writeProducts = (content) => writeJSON(productsJSONPath, content);

// Products pictures
export const saveProductPicture = (fileName, content) =>
  writeFile(join(productsPicturesFolderPath, fileName), content);
export const removeProductPicture = (fileName) =>
  remove(join(productsPicturesFolderPath, fileName));

// ************* Products Reviews *****************
export const readProductsReviews = () => readJSON(productsReviewsJSONPath);
export const writeProductsReviews = (content) =>
  writeJSON(productsReviewsJSONPath, content);
