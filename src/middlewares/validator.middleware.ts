import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";


export const validator = (schema:ZodSchema)=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        const result = schema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                success:false,
                message:"validation failed",
                error:result.error.issues
            })
        }

        req.body = result.data;
        next()
    }
}