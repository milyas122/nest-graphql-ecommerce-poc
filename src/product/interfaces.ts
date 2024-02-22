import { UserRole } from 'src/auth/entities/user.entity';
import { Product } from './entities/product.entity';

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

export interface IGetProductList {
  pages: number;
  total: number;
  products: Product[];
}
