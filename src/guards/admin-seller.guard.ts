import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../auth/entities/user.entity';

@Injectable()
export class AdminSellerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const allowedRoles = [UserRole.ADMIN, UserRole.SELLER];

    if (allowedRoles.includes(req.user.role)) {
      return true;
    }
    throw new ForbiddenException('only admin or seller can access this route');
  }
}
