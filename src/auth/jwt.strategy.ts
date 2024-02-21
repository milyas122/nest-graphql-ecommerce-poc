import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ICreateUser } from './interfaces';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IJwtPayload } from 'src/product/interfaces';
import { authConstants } from 'src/constants/verbose';

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
    const { sub } = payload;

    const isUser = await this.userRepository.findOneBy({ id: sub });

    if (!isUser) {
      throw new UnauthorizedException(authConstants.userNotFound);
    }
    const userObj: IJwtPayload = {
      id: isUser.id,
      email: isUser.email,
      name: isUser.name,
      role: isUser.role,
    };
    return userObj;
  }
}
