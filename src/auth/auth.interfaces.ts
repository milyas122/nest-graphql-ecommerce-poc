import { UserRole } from './entities/user.entity';

export interface ICreateUser {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}
