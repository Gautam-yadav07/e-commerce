
import express from 'express';
import { authentication } from '../middlewares/authentication.middleware.js';
import { authorization } from '../middlewares/authorization.middleware.js';
import { createAddressController } from '../controllers/address.controller.js';
import { validator } from '../middlewares/validator.middleware.js';
import { addressSchema } from '../validators/address.schema.js';

const router = express.Router();

router.post("/", authentication, authorization("CUSTOMER"), validator(addressSchema), createAddressController);



export default router;