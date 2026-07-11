import express from 'express';
import { createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController } from '../controllers/product.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { validator } from '../middlewares/validator.middleware.js';
import { productSchema, updateProductSchema } from '../validators/product.schema.js';

const router = express.Router()

router.post("/",authentication,authorization('SELLER'),validator(productSchema), createProductController);
router.get("/", getAllProductsController );
router.get("/:productId",getProductByIdController)
router.patch("/:productId",authentication,authorization("SELLER"), validator(updateProductSchema), updateProductController)
router.delete("/:productId", authentication, authorization("SELLER"), deleteProductController);

export default router;