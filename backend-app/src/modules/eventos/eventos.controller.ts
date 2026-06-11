import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Eventos')
@Controller('eventos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar Evento (Apenas Admin)' })
  create(@Req() req: any, @Body() dto: CreateEventoDto) {
    return this.eventosService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar Eventos (Admin vê todos, Aluno vê apenas da sua Turma)' })
  findAll(@Req() req: any) {
    if (req.user.tipoUsuario === 'ADMIN') {
      return this.eventosService.findAllAdmin();
    } else {
      return this.eventosService.findAllForStudent(req.user.id);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar detalhes de um Evento (Com verificação rigorosa de Turma)' })
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.eventosService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar dados de um Evento (Apenas Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateEventoDto) {
    return this.eventosService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir Evento (Apenas Admin)' })
  remove(@Param('id') id: string) {
    return this.eventosService.remove(+id);
  }

  @Get(':id/presencas')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Relatório de presenças dos formandos (Apenas Admin)' })
  getPresencasAdmin(@Param('id') id: string) {
    return this.eventosService.getPresencasAdmin(+id);
  }

  @Post(':id/presenca')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Confirmar/Recusar Presença (Apenas Aluno)' })
  setPresenca(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePresencaDto) {
    return this.eventosService.setPresenca(+id, req.user.id, dto);
  }
}
