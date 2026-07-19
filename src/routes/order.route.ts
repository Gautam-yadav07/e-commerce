import express from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { checkoutController, getByIdController, getMyOrdersController, updateOrderItemStatusController } from '../controllers/order.controller.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { tokenBucketLimiter } from '../middlewares/tokenBucketRateLimiter.middleware.js';
import { RATE_LIMIT } from '../config/rateLimit.config.js';


const router = express.Router();


router.post('/', authentication, tokenBucketLimiter(RATE_LIMIT.orders), checkoutController);
router.get('/', authentication,authorization("CUSTOMER"), getMyOrdersController);
router.get('/:id', authentication, authorization("CUSTOMER"), getByIdController);


router.patch(
  '/items/:itemId/status',
authentication,
  authorization('SELLER'),
  updateOrderItemStatusController
); 

export default router;
