import type { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/appError.js"


export const errorHandler =(err:Error, req:Request, res:Response, next:NextFunction)=>{
console.log("Error", err)

  if(err instanceof AppError){
    
    return res.status(err.status).json({
      success:false,
      message:err.message,
      status:err.status,
      
    });
    
  }

   return res.status(500).json({
    success: false,
    status: 500,
    message: "Internal Server Error",
  });

}


