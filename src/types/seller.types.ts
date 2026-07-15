
export interface CreateSellerProfileInput{
  user_id:number,
  shop_name:string,
  gst_number:string,
  bank_account_number:string,
  ifsc_code:string,
}

export interface SellerProfileResponse{
  id:number,
  user_id:number
  shop_name:string,
  gst_number:string,
  ifsc_code:string,
  bank_account_number:string,
  created_at:Date,
  updated_at:Date
}
