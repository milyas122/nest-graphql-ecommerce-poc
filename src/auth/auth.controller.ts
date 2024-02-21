import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto';
import { LoginDto } from './dto/login-user.dto';
import { SuccessResponse, sendSuccessResponse } from 'src/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * A function to register a user.
   *
   * @param {CreateUserDto} data - the data for creating a user
   * @return {Promise<SuccessResponse>} a promise that resolves to a success response
   */
  @Post('signup')
  async register(@Body() data: CreateUserDto): Promise<SuccessResponse> {
    const result = await this.authService.createUser(data);
    return sendSuccessResponse({
      statusCode: HttpStatus.CREATED,
      data: result,
    });
  }

  /**
   * Perform a login operation using the provided data.
   *
   * @param {LoginDto} data - the login data
   * @return {Promise<SuccessResponse>} the success response
   */
  @Post('login')
  async login(@Body() data: LoginDto): Promise<SuccessResponse> {
    const result = await this.authService.login(data);
    return sendSuccessResponse({
      data: result,
      statusCode: HttpStatus.OK,
    });
  }
}
