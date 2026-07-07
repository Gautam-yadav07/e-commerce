import type { NextFunction, Request, Response } from "express"
import { handleErrorResponse } from "../utils/handleErrorResponse.js"
import jwt from 'jsonwebtoken'
import type { AuthenticatedUser } from "../types/authTypes.js"
import { verifyToken } from "../utils/verifyToken.js"
import { AppError } from "../utils/appError.js"



export const authentication= (res:Response, req:Request, next:NextFunction)=>{
  try {
    const authHeader = req.headers.authorization;
    if(!authHeader){
      return handleErrorResponse(res,401,"Unauthorized");
    }

    const token = authHeader?.split(' ')[1];

    if(!token){
      return handleErrorResponse(res, 401, "Unauthorized");
    }

    const decoded = verifyToken(token);
      req.user = decoded ;
    
    
  } catch (error:any) {
    next(new AppError(500,"Internal server error", error.message));
  }
}




