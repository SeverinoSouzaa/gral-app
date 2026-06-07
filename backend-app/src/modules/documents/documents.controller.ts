import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Documentos')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Envia um novo documento para validação (Apenas Formandos)' })
  async enviarDocumento(@Req() req: any, @Body() dto: CreateDocumentDto) {
    return this.documentsService.enviarDocumento(req.user.id, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista os documentos enviados pelo usuário logado' })
  async listarMeusDocumentos(@Req() req: any) {
    return this.documentsService.listarMeusDocumentos(req.user.id);
  }

  @Get('pendentes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Lista todos os documentos pendentes de todas as turmas (Apenas ADMIN)' })
  async listarTodosPendentes() {
    return this.documentsService.listarTodosPendentes();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Aprova ou recusa um documento pendente (Apenas ADMIN)' })
  async avaliarDocumento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDocumentStatusDto,
  ) {
    return this.documentsService.avaliarDocumento(id, dto);
  }
}
