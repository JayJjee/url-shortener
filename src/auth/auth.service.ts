import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(email, password);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    console.log(
      'AuthService - JWT_SECRET:',
      process.env.JWT_SECRET || 'default_secret',
    );
    console.log('AuthService - Payload to sign:', payload);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
