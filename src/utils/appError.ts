
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
