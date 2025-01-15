import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { ApiBody, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({
    description: 'Dados para registrar o usuário',
    examples: {
      example1: {
        summary: 'Exemplo de registro',
        value: {
          email: 'teste@example.com',
          password: 'senhaforte',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Usuário registrado com sucesso',
    schema: {
      example: {
        email: 'teste@example.com',
        password: '$2a$10$91deo4...',
        id: '883a404f-1efa-4a6d-b646-d6b91da21c8b',
        createdAt: '2025-01-15T12:20:46.657Z',
        updatedAt: '2025-01-15T12:20:46.657Z',
      },
    },
  })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    return this.usersService.createUser(email, password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiBody({
    description: 'Credenciais do usuário para login',
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
    description: 'Usuário autenticado com sucesso',
    schema: {
      example: {
        id: '883a404f-1efa-4a6d-b646-d6b91da21c8b',
        email: 'teste@example.com',
        password: '$2a$10$91deo4...',
        createdAt: '2025-01-15T12:20:46.657Z',
        updatedAt: '2025-01-15T12:20:46.657Z',
      },
    },
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      return { message: 'Invalid email or password' };
    }

    // O token será adicionado no próximo passo.
    return user;
  }
}
