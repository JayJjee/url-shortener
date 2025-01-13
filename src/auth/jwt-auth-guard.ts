import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) return true; // Permite requisições sem autenticação

    const token = authHeader.split(' ')[1];
    if (!token) return true;

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Associa o usuário ao request
      return true;
    } catch {
      return true; // Caso o token seja inválido, trata como não autenticado
    }
  }
}
