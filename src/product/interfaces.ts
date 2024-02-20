import { UserRole } from 'src/auth/entities/user.entity';

export interface IJwtPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
