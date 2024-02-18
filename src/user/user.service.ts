import { Injectable } from '@nestjs/common';
import CreateUserDto from './dto';

@Injectable()
export class UserService {
  async createUser({ email, name, password }: CreateUserDto) {
    return {
      email,
      name,
      password,
    };
  }
}
