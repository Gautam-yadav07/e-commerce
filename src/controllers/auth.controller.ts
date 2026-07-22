import type{ Request, Response,NextFunction } from 'express';
import { forgotPasswordService, generateAccessTokenService, getUserProfileService, logoutService, resetPasswordService, userLoginService, userRegisterService} from '../services/auth.service.js';
import { handleSuccessResponse } from '../utils/handleSuccessResponse.js';
import { handleErrorResponse } from '../utils/handleErrorResponse.js';


export const userRegisterController = async (req: Request, res: Response, next:NextFunction)=> {
  try {
    const { email, name, password, phone_number, gender } = req.body ;

    const user = await userRegisterService(name, email, password, gender, phone_number);

    return handleSuccessResponse(res, 201, "User created Successfully", user);
    
  } catch (error) {
    console.error(error);
    next(error)
   
  }
};


export const userLoginController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
   const {email, password} = req.body;
 
   const user = await userLoginService({email, password});

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7*24*60*60*1000
    })
    
    const { refreshToken: _, ...data } = user;
   return handleSuccessResponse(res,200,"User Logged In  Succesfully", data);
   
  } catch (error) {
    next(error);
  }
}


export const getUserProfileController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const id = req.user?.id;

    if(!id){
      return handleErrorResponse(res,401,"Unauthorized");
    }

    const user = await getUserProfileService(id);

     return handleSuccessResponse(res,200, "User details fetched Successfully", user);
     
  } catch (error) {
    next(error)
  }
}



export const generateAccessTokenController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
      return handleErrorResponse(res, 401, "Refresh token is required...")
    }

    const token = await generateAccessTokenService(refreshToken);

    return handleSuccessResponse(res, 200, "Access token generated successfully", token);

  } catch (error) {
    next(error)
  }
}


export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return handleErrorResponse(res,401, "Refresh token is required");
    }

    const logout = await logoutService(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    return handleSuccessResponse(res, 200, "Logged out successfully",logout);

  } catch (error) {
    next(error);
  }
};

export const forgotPasswordController = async(req:Request, res:Response, next:NextFunction)=>{

  try{

    const {email}=req.body;

    const data = await forgotPasswordService(email);
    console.log(email)

    return handleSuccessResponse(res, 200, "A password reset link has been sent.", data );

  }catch(error){

    next(error);

  }

}


export const resetPasswordController = async(req:Request, res:Response, next:NextFunction)=>{
  try {
    const {password, token} = req.body;

    const resetPassword = await resetPasswordService(token, password);

    return handleSuccessResponse(res, 200, "Password Reset Successfully", resetPassword);

  } catch (error) {
    next(error)
  }
}