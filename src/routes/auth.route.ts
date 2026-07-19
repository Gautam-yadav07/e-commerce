import express from 'express'
import {getUserProfileController, generateAccessTokenController, userLoginController, userRegisterController, logoutController, forgotPasswordController, resetPasswordController } from '../controllers/auth.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';
import { validator } from '../middlewares/validator.middleware.js';
import { registerSchema } from '../validators/register.schema.js';
import { loginSchema } from '../validators/loginSchema.js';
import { forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.schema.js';
import { fixedWindowLimiter } from '../middlewares/fixedWindowRateLimiter.middleware.js';
import { RATE_LIMIT } from '../config/rateLimit.config.js';



// const authRateLimiter = fixedWindowLimiter({ 
//         prefix: "auth",
//         limit: 5,
//         windowInSeconds: 60,
//     }
// )

const router = express.Router();

router.post("/register", fixedWindowLimiter(RATE_LIMIT.register), validator(registerSchema), userRegisterController);
router.post("/login", fixedWindowLimiter(RATE_LIMIT.login), validator(loginSchema), userLoginController)
router.post("/refresh-token", generateAccessTokenController)
router.get("/me",authentication, getUserProfileController)
router.post("/logout", authentication, logoutController)

router.post("/forgot-password", fixedWindowLimiter(RATE_LIMIT.forgotPassword), validator(forgotPasswordSchema), forgotPasswordController);

router.post("/reset-password", fixedWindowLimiter(RATE_LIMIT.resetPassword), validator(resetPasswordSchema), resetPasswordController);

export default router;