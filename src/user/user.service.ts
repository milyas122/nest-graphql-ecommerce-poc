import { BadRequestException, Injectable } from '@nestjs/common';
import CreateUserDto from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ICreateUser } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {}

  async createUser({
    email,
    name,
    password,
  }: CreateUserDto): Promise<{ user: ICreateUser; access_token: string }> {
    const isUserExist = await this.userRepository.findOneBy({ email });

    if (isUserExist) {
      throw new BadRequestException('email already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      role: UserRole.BUYER,
      password: hashPassword,
    });

    await this.entityManager.save(user);

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { user: payload, access_token: accessToken };
  }
}
