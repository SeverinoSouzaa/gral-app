import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Se a rota não tiver @Roles(), qualquer usuário logado acessa
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Verifica se o tipoUsuario do Token JWT (STUDENT ou ADMIN) está contido nos papéis exigidos pela rota
    const hasRole = requiredRoles.includes(user.tipoUsuario);

    if (!hasRole) {
      throw new ForbiddenException('Acesso negado. Apenas a Equipe Interna pode executar esta ação.');
    }

    return true;
  }
}
