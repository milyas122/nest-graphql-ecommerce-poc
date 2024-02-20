import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ICreateUser } from './interfaces';

@Injectable()
export class AuthService {
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

    const accessToken = await this.generateToken(payload);

    return { user: payload, access_token: accessToken };
  }

  async login({
    email,
    password,
  }: LoginDto): Promise<{ user: ICreateUser; access_token: string }> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('email or password is invalid');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('email or password is invalid');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.generateToken(payload);

    return {
      user: payload,
      access_token: accessToken,
    };
  }

  async createSeller({ email, name, password }: CreateUserDto) {
    const isUserExist = await this.userRepository.findOneBy({ email });

    if (isUserExist) {
      throw new BadRequestException('email already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      role: UserRole.SELLER,
      password: hashPassword,
    });

    await this.entityManager.save(user);

    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  private async generateToken(payload: ICreateUser) {
    return await this.jwtService.signAsync(payload);
  }
}
