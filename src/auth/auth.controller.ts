import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async SignIn(@Body() signInDto: SignInDto) {
    console.log(signInDto);
    return this.authService.authenticate(signInDto);
  }
}
