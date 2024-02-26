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
  role: UserRoleString;
}

export interface ILogin extends ICreateUser {}
