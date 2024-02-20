import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/auth/entities/user.entity';

@Injectable()
export class SellerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.user.role === UserRole.SELLER) {
      return true;
    }
    throw new ForbiddenException('only seller can access this route');
  }
}
