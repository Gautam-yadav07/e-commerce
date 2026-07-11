import express from 'express';
import { createSellerProfileController } from '../controllers/seller.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { validator } from '../middlewares/validator.middleware.js';
import { sellerProfileSchema } from '../validators/sellerProfile.schema.js';

const router = express.Router()


router.post("/profile",authentication,authorization('CUSTOMER'), validator(sellerProfileSchema), createSellerProfileController);


export default router