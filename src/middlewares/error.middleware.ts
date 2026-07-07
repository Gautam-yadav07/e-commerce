
import type { NextFunction , Request, Response} from "express"
export class AppError extends Error{
  status:number
  message:string
  errorMessage:string
  constructor(status:number, message:string, errorMessage:string){
    super()
    this.status = status;
    this.message = message
    this.errorMessage= errorMessage
  }
}


export const errorHandler =(err:Error, req:Request, res:Response, next:NextFunction):void=>{

  if(err instanceof AppError){
    // console.log(err.status, err.message)
    res.status(err.status).json({
      success:false,
      message:err.message,
      status:err.status,
      errMessage:err.errorMessage
    })
  }

  
}


