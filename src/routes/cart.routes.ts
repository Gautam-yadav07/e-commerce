import express from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { getCartController } from '../controllers/cart.controller.js';

const router = express.Router()


router.get("/", authentication, authorization("CUSTOMER"), getCartController)