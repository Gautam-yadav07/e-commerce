import express from 'express'
import {getUserProfileController, generateAccessTokenController, userLoginController, userRegisterController } from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { validator } from '../middlewares/validator.middleware.js';
import { registerSchema } from '../validators/register.schema.js';
import { loginSchema } from '../validators/loginSchema.js';

const router = express.Router();

router.post("/register", validator(registerSchema), userRegisterController);
router.post("/login",validator(loginSchema), userLoginController)
router.post("/refresh-token", generateAccessTokenController)
router.get("/me",authentication, getUserProfileController)

export default router;