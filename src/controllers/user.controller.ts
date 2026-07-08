import type{ Request, Response,NextFunction } from 'express';
import { generateAccessTokenService, getUserProfileService, userLoginService, userRegisterService} from '../services/user.service.js';
import { handleSuccessResponse } from '../utils/handleSuccessResponse.js';
import { handleErrorResponse } from '../utils/handleErrorResponse.js';


export const userRegisterController = async (req: Request, res: Response, next:NextFunction)=> {
  try {
    const { email, name, password, phone_number, gender } = req.body ;

    // if (!email || !name||!password ||!phone_number) {
    //  return handleErrorResponse(res,400, "All the fields are required");
    //  }

    const user = await userRegisterService(name, email, password, gender, phone_number);

    handleSuccessResponse(res, 201, "User created Successfully", user)
    return;
    
  } catch (error) {
    console.error(error);
    next(error)
   
  }
};



export const userLoginController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
   const {email, password} = req.body;
 
  //  if(!email || !password){
  //   return handleErrorResponse(res, 400, "Email and password are required")
  //  }
   const user = await userLoginService({email, password})

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
    })

   return handleSuccessResponse(res,200,"User Logged In  Succesfully", user)
   
  } catch (error) {
    // next(new AppError(500, "Something went wrong"));
    next(error)
  }
}



export const getUserProfileController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const id = req.user?.id;

    if(!id){
      return handleErrorResponse(res,401,"Unauthorized");
    }

    const user = await getUserProfileService(id);
    handleSuccessResponse(res,200, "User details fetched Successfully", user)
  } catch (error) {
    next(error)
  }
}



export const refreshAccessTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refresh_token

    if(!refreshToken){
      return handleErrorResponse(res, 401, "Refresh token is required")
    }

    const token = await generateAccessTokenService(refreshToken)

    return handleSuccessResponse(res, 200, "Access token generated successfully", token)
  } catch (error) {
    next(error)
  }
}
