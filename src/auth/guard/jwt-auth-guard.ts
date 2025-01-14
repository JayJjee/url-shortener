import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_NAME } from '../common/auth.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      const token = this.extractTokenHeader(request);
      if (token) {
        try {
          const payload = await this.jwtService.verifyAsync(
            token,
            this.jwtConfiguration,
          );
          request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
        } catch (error) {
          console.log(error);
          throw new UnauthorizedException('Erro no serviço.');
        }
      }
      return true;
    }

    const token = this.extractTokenHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token não encontrado!');
    }

    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload;
    } catch (error) {
      throw new UnauthorizedException('Acesso não autorizado.', error);
    }

    return true;
  }

  extractTokenHeader(request: Request) {
    const authorization = request.headers?.authorization;
    if (!authorization || typeof authorization !== 'string') {
      return;
    }
    return authorization.split(' ')[1];
  }
}
