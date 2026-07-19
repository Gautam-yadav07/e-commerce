import { Router } from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { getPaymentDetailsController, processPaymentController } from '../controllers/payment.controller.js';
import { validator } from '../middlewares/validator.middleware.js';
import { processPaymentSchema } from '../validators/payment.schema.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { tokenBucketLimiter } from '../middlewares/tokenBucketRateLimiter.middleware.js';
import { RATE_LIMIT } from '../config/rateLimit.config.js';


const router = Router();

router.use(authentication);
router.use(authorization("CUSTOMER"))

router.post('/', tokenBucketLimiter(RATE_LIMIT.payments), validator(processPaymentSchema), processPaymentController);
router.get('/:orderId', getPaymentDetailsController);

export default router;