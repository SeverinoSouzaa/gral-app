import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Eventos (Provisório)')
@Controller('eventos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventosController {
  constructor(private prisma: PrismaService) {}

  @Get('turma')
  @ApiOperation({ summary: 'Listar eventos da turma do aluno (Filtros de mídia)' })
  async getEventosTurma(@Req() req: any) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: req.user.id },
      include: { formando: true },
    });

    let turmaId;
    if (usuario?.tipoUsuario === 'STUDENT' && usuario.formando) {
      turmaId = usuario.formando.turmaId;
    }

    if (!turmaId) return [];

    return this.prisma.evento.findMany({
      where: { turmaId },
      select: { id: true, nomeEvento: true, dataEvento: true }
    });
  }
}
