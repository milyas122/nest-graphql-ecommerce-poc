import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserInput, LoginUserInput } from './dto/inputs';
import { UserRole } from './interfaces';
import { LoginUserPayload, RegisterUserPayload } from './dto';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from 'src/guards';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => LoginUserPayload)
  async loginUser(
    @Args('loginData') loginData: LoginUserInput,
  ): Promise<LoginUserPayload> {
    return await this.authService.login(loginData);
  }

  @Mutation((returns) => RegisterUserPayload)
  async signupUser(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<RegisterUserPayload> {
    return this.authService.createUser(createUserData, UserRole.BUYER);
  }

  @Mutation((returns) => RegisterUserPayload)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  async registerSeller(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<RegisterUserPayload> {
    return this.authService.createUser(createUserData, UserRole.SELLER);
  }
}
