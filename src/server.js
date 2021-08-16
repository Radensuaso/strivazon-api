import express from "express"; // import express from express
import cors from "cors"; // will enable the frontend to communicate with the backend
import listEndpoints from "express-list-endpoints"; // will show us the detailed endpoints
import {
  notFoundHandler,
  badRequestHandler,
  forbiddenHandler,
  genericServerErrorHandler,
} from "./errorHandlers.js";
import productsRouter from "./services/products/index.js";
import productsReviewsRouter from "./services/productsReviews/index.js";
import { join } from "path";

const server = express(); //our server function initialized with express()
const port = 3001; // this will be the port on with the server will run
const publicFolderPath = join(process.cwd(), "public");

//=========== GLOBAL MIDDLEWARES ======================
server.use(express.static(publicFolderPath)); //grants access to the public folder in the url
server.use(cors());
server.use(express.json()); // this will enable reading of the bodies of requests, THIS HAS TO BE BEFORE server.use("/authors", authorsRouter)

// ========== ROUTES =======================
server.use("/products", productsRouter);
server.use("/productsReviews", productsReviewsRouter); // this will provide the endpoints of authors with a common name to POST, GET, PUT and DELETE

// ============== ERROR HANDLING ==============

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(genericServerErrorHandler);

console.table(listEndpoints(server)); // will show us the detailed endpoints in a table

server.listen(port, () =>
  console.log(`Server is listening to the port ${port}.`)
);
