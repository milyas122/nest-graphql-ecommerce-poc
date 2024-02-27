import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { User } from './entities/user.entity';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthSubscriber } from './auth.subscriber';
import { RolePermission } from './entities/role.permission.entity';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RolePermission]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.getOrThrow('JWT_EXPIRES_IN')}s`,
        },
      }),
    }),
  ],
  controllers: [],
  providers: [AuthResolver, AuthService, JwtStrategy, AuthSubscriber],
  exports: [AuthService],
})
export class AuthModule {}
