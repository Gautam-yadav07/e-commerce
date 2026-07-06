import type{ Request, Response } from 'express';
import { userRegisterService} from '../services/user.service.js';


export const userRegisterController = async (req: Request, res: Response)=> {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ 
        success:false,
        error: 'Email and name are required' 
      });
    }

    const user = await userRegisterService({ email, name });
    
    res.status(201).json({ 
      success:true,
      message: 'User created successfully',
      data: user 
    });

  } catch (error:any) {
    res.status(500).json({ 
      success:false,
      error: error.message,
    });
  }
};



// const handleResponse = (res, status, message, data=null)=>{
//     res.status(status).json({
//         status,
//         message,
//         data,
//     })
// }
