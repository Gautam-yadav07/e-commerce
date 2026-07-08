import type { Request,Response,NextFunction } from "express"
import { handleErrorResponse } from "../utils/handleErrorResponse.js"

export const authorize= (...roles:string[])=>{
    if(roles.length ===0){
        throw new Error("Middleware requires at least one role")
    }

  return (req:Request, res:Response, next:NextFunction):void=>{

    if(!req.user){
       handleErrorResponse(res, 401, "Unauthorized");
       return
    }

    if(!roles.includes(req.user.role)){
      handleErrorResponse(res, 403, "Forbidden")
      return;
    }

    next()

  }
}