import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/dto/signin.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Obter JWT Token' })
  @ApiBody({
    description: 'Credenciais para autenticação',
    examples: {
      example1: {
        summary: 'Exemplo de login',
        value: {
          email: 'teste@example.com',
          password: 'senhaforte',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Token JWT retornado com sucesso',
    schema: {
      example: {
        id: '883a404f-1efa-4a6d-b646-d6b91da21c8b',
        email: 'teste@example.com',
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  async SignIn(@Body() signInDto: SignInDto) {
    console.log(signInDto);
    return this.authService.authenticate(signInDto);
  }
}
