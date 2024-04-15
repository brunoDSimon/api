import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {

  }
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const {user} = context.switchToHttp().getRequest();


    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[ context.getHandler(), context.getClass()])

    let dadosUsuario = await user.then(user => user)

    if(!requiredRoles)  {
      return true
    }

    let regras = requiredRoles.filter(role => role == dadosUsuario.role)
    return regras.length > 0
  }
}
