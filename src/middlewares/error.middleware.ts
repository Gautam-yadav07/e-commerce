import type { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError.js"


export const errorHandler =(err:Error, req:Request, res:Response, next:NextFunction):void=>{

  if(err instanceof AppError){
    
    res.status(err.status).json({
      success:false,
      message:err.message,
      status:err.status,
      errMessage:err.errorMessage
    });
  }

   res.status(500).json({
    success: false,
    status: 500,
    message: "Internal Server Error",
    errorMessage: err.message,
  });

}


