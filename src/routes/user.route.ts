import express from 'express'
import {getUserProfileController, refreshAccessTokenController, userLoginController, userRegisterController } from '../controllers/user.controller.js';
import { authentication } from '../middlewares/authentication.middleware.js';

const router = express.Router();

router.post("/register", userRegisterController);
router.post("/login", userLoginController)
router.post("/refresh-token", refreshAccessTokenController)
router.get("/me",authentication, getUserProfileController)

export default router;