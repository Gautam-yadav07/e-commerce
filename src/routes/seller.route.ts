import express from 'express';
import { createSellerProfileController } from '../controllers/seller.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';

const router = express.Router()


router.post("/profile",authentication,authorization('customer') ,createSellerProfileController);


export default router