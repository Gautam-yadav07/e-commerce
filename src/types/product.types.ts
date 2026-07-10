import type { ProductStatus } from "../generated/prisma/enums.js"


export interface CreateProductInput {
  seller_id:number,
  name:string,
  description : string,
  price:number,
  discount?: number,
  stock:number,
  status:ProductStatus

}

export interface ProductResponse{
  id:number,
  seller_id:number,
  name:string,
  description:string,
  price:number,
  discount?: number,
  stock:number,
  status:ProductStatus
  created_at :Date
  updated_at: Date
}
