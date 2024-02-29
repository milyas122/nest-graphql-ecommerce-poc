export enum UserRole {
  ADMIN = 'admin',
  SELLER = 'seller',
  BUYER = 'buyer',
}

export type UserRoleString = `${UserRole}`;

export const userRoleMap: { [key: string]: UserRole } = {
  admin: UserRole.ADMIN,
  seller: UserRole.SELLER,
  buyer: UserRole.BUYER,
};

export interface ICreateUser {
  sub: string;
  email: string;
  name: string;
  // role: UserRoleString;
  role: UserRole;
}

export interface ILogin extends ICreateUser {}

export interface ILoginUser {
  access_token: string;
  user: ILogin;
}

export interface IRegisterUser {
  access_token: string;
  user: ICreateUser;
}
