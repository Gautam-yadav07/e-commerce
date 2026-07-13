import prisma from "../config/prisma.js";
import { AuthRepositoryFactory } from "../factories/auth.repository.factory.js";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/appError.js";
import jwt from 'jsonwebtoken'
import type { AuthenticatedUser, RegisterInput } from "../types/authTypes.js";
import type { Gender } from "../generated/prisma/enums.js";
import { publishForgotPasswordEmail } from "../queue/email.publisher.js";
import crypto from 'crypto'


export interface UserLoginInput {
  email: string,
  password: string
}
const userRepository = AuthRepositoryFactory.create()

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is missing")
}

export const userRegisterService = async (name: string, email: string, password: string, gender: Gender, phone_number: string) => {

  const existingEmail = await userRepository.findByEmail(email)
  const existingPhone = await userRepository.findByPhoneNumber(phone_number)
  if (existingEmail) {
    throw new AppError(409, "Email already exist")
  }

  if (existingPhone) {
    throw new AppError(409, "Phone number already exist")
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userInput = {
    name,
    email,
    hashedPassword,
    gender,
    phone_number
  }

  const newUser = await userRepository.createUser(userInput)

  return newUser;
};


export const userLoginService = async (data: UserLoginInput) => {
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role_name
    },
    JWT_SECRET_KEY as string,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET_KEY as string,
    { expiresIn: '7d' }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  const token = await userRepository.updateRefreshToken(user.id, hashedRefreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role_name: user.role_name,
      created_at: user.created_at
    }

  }
}


export const getUserProfileService = async (id: number) => {
  const user = await userRepository.findById(id)
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return user
}




export const generateAccessTokenService = async (refreshToken: string) => {
  // if(!refreshToken){
  //   throw new AppError(401, "Refresh token is required....")
  // }

  const decoded = jwt.verify(refreshToken, JWT_SECRET_KEY) as AuthenticatedUser
  if (!decoded) {
    throw new AppError(401, "Unauthenticated")
  }
  console.log(decoded)

  const user = await userRepository.findByIdWithRefreshToken(decoded.id)

  if (!user || !user.refresh_token) {
    throw new AppError(401, "Unauthorized")
  }


  const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refresh_token)

  if (!isRefreshTokenValid) {
    throw new AppError(401, "Unauthorized....")
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role_name,
    },
    JWT_SECRET_KEY as string,
    { expiresIn: "15m" }
  )

  return {
    accessToken
  }
}


export const logoutService = async (
  refreshToken: string
): Promise<void> => {

  let decoded: AuthenticatedUser;

  try {
    decoded = jwt.verify(
      refreshToken,
      JWT_SECRET_KEY
    ) as AuthenticatedUser;
  } catch {
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await userRepository.findByIdWithRefreshToken(
    decoded.id
  );

  if (!user || !user.refresh_token) {
    throw new AppError(401, "Unauthorized");
  }

  const isValid = await bcrypt.compare(refreshToken, user.refresh_token);

  if (!isValid) {
    throw new AppError(401, "Unauthorized");
  }

  await userRepository.logoutUser(user.id);
}


export const forgotPasswordService = async (email: string) => {

  const user = await userRepository.findByEmail(email);
  if (!user) {
    return;
  }
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  const savedResetToken = await userRepository.saveResetPasswordToken(
    user.id,
    hashedToken,
    expiry
  );
  console.log(savedResetToken)
  await publishForgotPasswordEmail({
    email: user.email,
    name: user.name,
    token: resetToken
  });

}

export const resetPasswordService = async (token: string, password: string) => {

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userRepository.findByResetPasswordToken(hashedToken);

  if (!user) {

    throw new AppError(400, "Invalid reset token.");
  }

  if (!user.reset_password_expiry || user.reset_password_expiry < new Date()) {

    throw new AppError(400, "Reset token has expired.");

  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepository.updatePassword(user.id, hashedPassword);

}

