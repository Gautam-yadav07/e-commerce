import type{ Response } from "express";

export interface ApiErrorResponse {
  success: boolean;
  status: number;
  errorMessage: string;
 
}

export const handleErrorResponse = (
  res: Response,
  status: number,
  errorMessage: string,
  
): Response<ApiErrorResponse> => {
  return res.status(status).json({
    success: false,
    status,
    errorMessage,
  });

  
};





