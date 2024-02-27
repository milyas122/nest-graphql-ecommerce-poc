import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { ICreateUser } from './interfaces';
import { User } from './entities/user.entity';
import { IJwtPayload } from 'src/product/interfaces';
import { authConstants } from 'src/constants/verbose';
import { UserRole } from './interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: ICreateUser): Promise<IJwtPayload> {
    console.log(payload);
    const { sub } = payload;
    const isUser = await this.userRepository.findOneBy({ id: sub });
    if (!isUser) {
      throw new UnauthorizedException(authConstants.userNotFound);
    }
    const userObj: IJwtPayload = {
      id: isUser.id,
      email: isUser.email,
      name: isUser.name,
      role: UserRole[isUser.role.toUpperCase()],
    };
    return userObj;
  }
}
