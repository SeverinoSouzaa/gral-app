import { Controller, Get, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do usuário autenticado baseado no Token JWT' })
  @ApiResponse({ status: 200, description: 'Dados do usuário retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado.' })
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    const usuario = await this.usersService.findById(userId);

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
    };
  }
}
