import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, SetMetadata, UseGuards } from '@nestjs/common';

import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
import { CreateUserInput, LoginUserInput } from './dto/inputs';
import { UserRole } from './interfaces';
import { LoginUserPayload, RegisterUserPayload } from './dto';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

@Resolver((of) => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  /**
   * A login user resolver that logs in a user with the provided login data
   *
   * @param {LoginUserInput} loginData - the login input data for the user
   * @return {Promise<LoginUserPayload>} the payload containing the logged in user's information
   */
  @Mutation((returns) => LoginUserPayload)
  async loginUser(
    @Args('loginData') loginData: LoginUserInput,
  ): Promise<LoginUserPayload> {
    const data = await this.authService.login(loginData);
    return {
      status: HttpStatus.ACCEPTED,
      message: 'Login successfully',
      data,
    };
  }

  /**
   * A signup user resolver that creates a new user (buyer)
   *
   * @param {CreateUserInput} createUserData - input data for creating a new user
   * @return {Promise<RegisterUserPayload>} the payload containing the newly registered user with access_token
   */
  @Mutation((returns) => RegisterUserPayload)
  async signupUser(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<RegisterUserPayload> {
    const data = await this.authService.createUser(
      createUserData,
      UserRole.BUYER,
    );
    return {
      status: HttpStatus.ACCEPTED,
      message: 'Signup successfully',
      data,
    };
  }

  /**
   * A register seller resolver that creates a new user (seller) only for admin
   *
   * @param {CreateUserInput} createUserData - input data for creating a new seller
   * @return {Promise<RegisterUserPayload>} the payload containing the newly registered seller with access_token
   */
  @Mutation((returns) => RegisterUserPayload)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @SetMetadata('roles', [UserRole.ADMIN])
  async registerSeller(
    @Args('createUserData') createUserData: CreateUserInput,
  ): Promise<RegisterUserPayload> {
    const data = await this.authService.createUser(
      createUserData,
      UserRole.SELLER,
    );
    return {
      status: HttpStatus.ACCEPTED,
      message: 'Signup successfully',
      data,
    };
  }
}
