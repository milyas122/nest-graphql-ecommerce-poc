import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body(
      new ValidationPipe({
        dismissDefaultMessages: true,
      }),
    )
    data: CreateUserDto,
  ) {
    return this.userService.createUser(data);
  }
}
