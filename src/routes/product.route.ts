import express from 'express';
import { createProductController, getAllProductsController, getProductByIdController } from '../controllers/product.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { validator } from '../middlewares/validator.middleware.js';
import { productSchema } from '../validators/product.schema.js';

const router = express.Router()

router.post("/",authentication,authorization('SELLER'),validator(productSchema), createProductController);
router.get("/", getAllProductsController );
router.get("/:id",getProductByIdController)
export default router;