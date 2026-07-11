export interface CreateAddressInput {
    user_id:number,
  address_line: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
}

export interface AddressResponse {
  id: number;
  user_id: number;
  address_line: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  created_at: Date;
  updated_at: Date;
}