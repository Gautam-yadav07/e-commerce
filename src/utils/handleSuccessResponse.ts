import type{ Response } from "express";

export interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: any;
}
export const handleSuccessResponse = (
  res: Response,
  status: number,
  message: string,
  data:any
): Response<ApiResponse> => {

  return res.status(status).json({
    success: true,
    status,
    message,
    data,
  });
};



