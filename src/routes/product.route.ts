import express from 'express';
import { createProductController } from '../controllers/product.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { validator } from '../middlewares/validator.middleware.js';
import { productSchema } from '../validators/product.schema.js';

const router = express.Router()

router.post("/",authentication,authorization('seller'),validator(productSchema), createProductController);

export default router;