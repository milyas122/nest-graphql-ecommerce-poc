import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { ICreateUser, ILoginUser, IRegisterUser, UserRole } from './interfaces';
import { authConstants } from 'src/lib/constants';
import { CreateUserInput, LoginUserInput } from './dto/inputs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Creates a new user (seller or buyer) with the provided data.
   *
   * @param {CreateUserDto} data - the data for creating a new user
   * @return {Promise<{ user: ICreateUser; access_token: string; }>} a promise that resolves with the created user object and an access token
   */
  async createUser(
    data: CreateUserInput,
    role: UserRole,
  ): Promise<IRegisterUser> {
    try {
      const isUserExist = await this.userRepository.findOneBy({
        email: data.email,
      });
      if (isUserExist) {
        throw new BadRequestException(authConstants.emailAlreadyExist);
      }
      const user = new User({ role, ...data });
      await this.userRepository.save(user);
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role,
      };
      const accessToken = await this._generateToken(payload);
      return { user: payload, access_token: accessToken };
    } catch (error) {
      throw new HttpException(
        { message: error.message, statusCode: error.status },
        error.status,
      );
    }
  }

  /**
   * A login service that authenticate a user against database record
   *
   * @param {LoginDto} data - data object require for login
   * @return {Promise<{ user: ICreateUser; access_token: string }>} a promise that resolves with the created user object and an access token
   */
  async login(data: LoginUserInput): Promise<ILoginUser> {
    try {
      const { email, password } = data;
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new UnauthorizedException(authConstants.emailPasswordError);
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException(authConstants.emailPasswordError);
      }
      const payload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: UserRole[user.role.toUpperCase()],
      };
      console.log(UserRole[user.role.toUpperCase()]);
      const accessToken = await this._generateToken(payload);
      return {
        user: payload,
        access_token: accessToken,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        { message: error.message, statusCode: error.status },
        error.status,
      );
    }
  }

  /**
   * Helper function to generate a token for the given payload.
   *
   * @param {ICreateUser} payload - the payload to be used for generating the token
   * @return {Promise<string>} the generated token
   */
  private async _generateToken(payload: ICreateUser): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  async findOneBy(where: Partial<User>) {
    try {
      return await this.userRepository.findOneBy({ ...where });
    } catch (error) {
      throw new HttpException(
        { message: error.message, statusCode: error.status },
        error.status,
      );
    }
  }

  async findSellerByIds(ids: string[]) {
    try {
      return await this.userRepository.find({
        where: { id: In(ids), role: UserRole.SELLER },
      });
    } catch (error) {
      throw new HttpException(
        { message: error.message, statusCode: error.status },
        error.status,
      );
    }
  }
}
