import type { NextFunction, Request, Response } from "express"
import { handleErrorResponse } from "../utils/handleErrorResponse.js"
import { verifyToken } from "../utils/verifyToken.js"
import { AppError } from "../utils/appError.js"



export const authentication= (req:Request,res:Response, next:NextFunction)=>{
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
    next();
    
    
  } catch (error) {
    next(new AppError(500,"Internal server error"));
  }
}




