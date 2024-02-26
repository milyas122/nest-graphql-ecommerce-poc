import { Product } from './entities/product.entity';
import { UserRoleString } from 'src/auth/interfaces';

export interface IJwtPayload {
  id: string;
  email: string;
  name: string;
  role: UserRoleString;
}

export interface IUpdateProduct {
  productId: string;
  userId: string;
  role: UserRoleString;
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
  current_page: number;
  total_pages: number;
  total: number;
  products: Product[];
}
