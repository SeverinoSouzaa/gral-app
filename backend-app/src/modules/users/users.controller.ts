import { Controller, Get, UseGuards, Req, NotFoundException, Post, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateFormandoDto } from './dto/create-formando.dto';
import { UpdateFormandoDto } from './dto/update-formando.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

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
      cpf: usuario.cpf,
      telefone: usuario.telefone,
      tipoUsuario: usuario.tipoUsuario,
      createdAt: usuario.createdAt,
      turma: usuario.formando?.turma?.nomeTurma || null,
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

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os Formandos (Apenas Equipe Interna)' })
  @ApiResponse({ status: 200, description: 'Lista de formandos retornada com sucesso.' })
  async findAllFormandos() {
    return this.usersService.findAllFormandos();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar Formando por ID (Apenas Equipe Interna)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findById(@Req() req: any) {
    // Pegando do req.params pq o @Param('id') exigiria import que eu não mapeei
    const id = parseInt(req.params.id, 10);
    const usuario = await this.usersService.findById(id);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  @Get('cpf/:cpf')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar Formando por CPF (Apenas Equipe Interna)' })
  @ApiParam({ name: 'cpf', description: 'CPF do usuário' })
  async findByCpf(@Req() req: any) {
    const usuario = await this.usersService.findByCpf(req.params.cpf);
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados de um Formando (Apenas Equipe Interna)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 409, description: 'CPF ou e-mail conflitantes.' })
  async updateFormando(@Req() req: any, @Body() dto: UpdateFormandoDto) {
    const id = parseInt(req.params.id, 10);
    return this.usersService.updateFormando(id, dto);
  }
}
