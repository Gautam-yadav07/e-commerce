import express from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { addItemToCartController, getCartController, removeItemFromCartController, updateItemController } from '../controllers/cart.controller.js';
import { validator } from '../middlewares/validator.middleware.js';
import { cartSchema } from '../validators/cart.schema.js';

const router = express.Router()


router.get("/", authentication, authorization("CUSTOMER"), getCartController)

router.post('/items',authentication,authorization("CUSTOMER"), addItemToCartController);

router.patch('/items/:itemId',authentication, authorization("CUSTOMER"), validator(cartSchema), updateItemController);

router.delete('/items/:itemId',authentication,authorization("CUSTOMER"), removeItemFromCartController);


export default router;