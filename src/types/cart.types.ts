export interface CartResponse {
  id: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface CartItemResponse {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: string;
  user_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CartDetails {
  cart_item_id: number;
  product_id: number;
  quantity: number;
  cart_item_price: number;
  product_name: string;
  product_description: string | null;
  product_price: number;
  product_discount: number | null;
  product_stock: number;
  product_status: string;
  shop_name: string;
  seller_user_id: number;
}