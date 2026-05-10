import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthPayload } from './models/auth-payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(input: RegisterInput): Promise<AuthPayload> {
    const existing = await this.userService.findByEmail(input.email);
    if (existing) throw new ConflictException('Email already in use');

    const existingUsername = await this.userService.findByUsername(input.username);
    if (existingUsername) throw new ConflictException('Username already taken');

    const hashed = await bcrypt.hash(input.password, 10);
    const user = await this.userService.create({ ...input, password: hashed });
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user };
  }

  async login(input: LoginInput): Promise<AuthPayload> {
    const user = await this.userService.findByEmail(input.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user };
  }
}
