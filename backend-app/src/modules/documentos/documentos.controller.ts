import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoStatusDto } from './dto/update-documento-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Documentos')
@Controller('documentos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post()
  @Roles('STUDENT')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/documentos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `doc-${uniqueSuffix}${ext}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite rigoroso de 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
        return cb(new BadRequestException('Apenas arquivos JPG, PNG ou PDF são permitidos!'), false);
      }
      cb(null, true);
    },
  }))
  @ApiOperation({ summary: 'Enviar um Documento (Apenas Formando)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Dados do documento e arquivo em anexo',
    type: CreateDocumentoDto,
  })
  @ApiResponse({ status: 201, description: 'Documento enviado com sucesso.' })
  async uploadDocumento(
    @Req() req: any,
    @Body() dto: CreateDocumentoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.documentosService.uploadDocumento(req.user.id, dto, file);
  }

  @Get('me')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Listar Documentos do Formando Logado (Apenas Formando)' })
  @ApiResponse({ status: 200, description: 'Lista de documentos.' })
  async findMyDocumentos(@Req() req: any) {
    return this.documentosService.findMyDocumentos(req.user.id);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar TODOS os Documentos (Apenas Equipe Interna)' })
  @ApiResponse({ status: 200, description: 'Lista completa com informações dos formandos.' })
  async findAllDocumentos() {
    return this.documentosService.findAllDocumentos();
  }

  @Patch(':id/status')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Aprovar ou Rejeitar um Documento (Apenas Equipe Interna)' })
  @ApiResponse({ status: 200, description: 'Status do documento atualizado com sucesso.' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateDocumentoStatusDto) {
    return this.documentosService.updateStatus(+id, dto);
  }
}
