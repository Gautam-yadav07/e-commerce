import { Router } from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { createRazorpayOrderController, getPaymentDetailsController, processPaymentController, verifyPaymentController } from '../controllers/payment.controller.js';
import { validator } from '../middlewares/validator.middleware.js';
import { processPaymentSchema } from '../validators/payment.schema.js';
import { authorization } from '../middlewares/authorization.middleware.js';


const router = Router();

router.use(authentication);
router.use(authorization("CUSTOMER"))

router.post('/', validator(processPaymentSchema) , processPaymentController);
router.get('/:orderId', getPaymentDetailsController);

router.post("/order", createRazorpayOrderController);
router.post("/verify", verifyPaymentController)

export default router;