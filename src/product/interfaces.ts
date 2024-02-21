import { UserRole } from 'src/auth/entities/user.entity';

export interface IJwtPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface IUpdateProduct {
  productId: string;
  userId: string;
  role: UserRole;
}

export interface IRemoveProduct extends IUpdateProduct {}

export interface ICreateProductResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
}

export interface IGetProductDetailResponse extends ICreateProductResponse {
  seller: IJwtPayload;
}
