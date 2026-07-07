import type{ Request, Response } from 'express';
import { userRegisterService} from '../services/user.service.js';
import { handleSuccessResponse } from '../utils/handleSuccessResponse.js';
import { handleErrorResponse } from '../utils/handleErrorResponse.js';
import { AppError } from '../middlewares/error.middleware.js';
import { registerSchema } from '../validators/register.schema.js';
// import { AppError } from '../middlewares/error.middleware.js';


export const userRegisterController = async (req: Request, res: Response)=> {
  try {
    const { email, name } = req.body;

    if (!email || !name) {

     handleErrorResponse(res,400, "Email and name are required");
     }
    const user = await userRegisterService({ email, name });
    
    handleSuccessResponse(res,201, "User created Successfully",user)
    
  } catch (error:any) {
     throw new AppError(500,"Something went wrong", error.message)
   
  }
};





