import type{ Request, Response,NextFunction } from 'express';
import { userRegisterService} from '../services/user.service.js';
import { handleSuccessResponse } from '../utils/handleSuccessResponse.js';
import { handleErrorResponse } from '../utils/handleErrorResponse.js';
import { AppError } from '../utils/appError.js';


export const userRegisterController = async (req: Request, res: Response, next:NextFunction)=> {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
     return handleErrorResponse(res,400, "Email and name are required");
     }

    const user = await userRegisterService({ email, name });
    return handleSuccessResponse(res,201, "User created Successfully",user)
    
  } catch (error:any) {
    next(new AppError(500, "Something went wrong", error.message));
   
  }
};





