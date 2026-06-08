import { Controller, Get, UseGuards, Req, NotFoundException, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateFormandoDto } from './dto/create-formando.dto';
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

  @Post('formando')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastrar novo Formando (Apenas Equipe Interna)' })
  @ApiResponse({ status: 201, description: 'Formando cadastrado com sucesso.' })
  @ApiResponse({ status: 409, description: 'CPF ou e-mail já estão em uso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (Requer papel de ADMIN).' })
  async createFormando(@Body() dto: CreateFormandoDto) {
    return this.usersService.createFormando(dto);
  }
}
