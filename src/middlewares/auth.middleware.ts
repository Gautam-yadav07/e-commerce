import type { NextFunction, Request, Response } from "express"
import { handleErrorResponse } from "../utils/handleErrorResponse.js"
import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from "../types/authTypes.js"
import { verifyToken } from "../utils/verifyToken.js"
import { AppError } from "./error.middleware.js"


export const authenticate= (res:Response, req:Request, next:NextFunction)=>{
  try {
    const authHeader = req.headers.authorization
    if(authHeader){
      handleErrorResponse(res,401,"Unauthorized")
    }
    const token = authHeader?.split(' ')[1]
    if(!token){
      handleErrorResponse(res, 401, "Unauthorized")
    }
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY


    if(token === 'string'){
     const decoded = verifyToken(token)

      req.user = decoded 
    }
    
  } catch (error:any) {
    throw new AppError(500,"Internal server error", error.message)
  }
}




export const authorize= (...roles:string[])=>{
  return (req:Request, res:Response, next:NextFunction):void=>{
    if(!roles.includes(req.user.role)){
      handleErrorResponse(res,401, "Unauthorized")
    }
    next()

  }
}