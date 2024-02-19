import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import CreateUserDto from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('signup')
  async signupUser(
    @Body()
    data: CreateUserDto,
  ) {
    return this.userService.createUser(data);
  }
}
