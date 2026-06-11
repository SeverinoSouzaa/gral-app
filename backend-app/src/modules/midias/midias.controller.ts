import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException, Query, Res, StreamableFile } from '@nestjs/common';
import { MidiasService } from './midias.service';
import { CreateMidiaDto } from './dto/create-midia.dto';
import { UpdateMidiaDto } from './dto/update-midia.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiQuery, ApiBody } from '@nestjs/swagger';
import type { Response } from 'express';
import * as fs from 'fs';

const uploadPath = './uploads/midias';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

@ApiTags('Mídias')
@Controller('midias')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MidiasController {
  constructor(private readonly midiasService: MidiasService) {}

  @Post()
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: uploadPath,
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `media-${uniqueSuffix}${ext}`);
      },
    }),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|mp4|mov)$/)) {
        return cb(new BadRequestException('Apenas imagens ou vídeos permitidos!'), false);
      }
      cb(null, true);
    },
  }))
  @ApiOperation({ summary: 'Fazer upload de foto ou vídeo (Apenas Equipe Interna)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMidiaDto })
  async uploadMidia(
    @Req() req: any,
    @Body() dto: CreateMidiaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.midiasService.uploadMidia(req.user.id, dto, file);
  }

  @Get('download-zip')
  @ApiOperation({ summary: 'Baixar fotos ou vídeos em um arquivo .zip (Formando e Admin)' })
  @ApiQuery({ name: 'tipo', required: false, enum: ['foto', 'video'], description: 'Filtrar por tipo para o ZIP' })
  async downloadZip(@Req() req: any, @Res({ passthrough: true }) res: Response, @Query('tipo') tipo?: string): Promise<StreamableFile> {
    const stream = await this.midiasService.createZipStream(req.user.id, tipo);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="midias-${tipo || 'todas'}.zip"`,
    });
    return stream;
  }

  @Get()
  @ApiOperation({ summary: 'Listar Mídias (Filtra automaticamente pela Turma do aluno)' })
  @ApiQuery({ name: 'eventoId', required: false, type: String })
  @ApiQuery({ name: 'tipo', required: false, enum: ['foto', 'video'] })
  async findMidias(@Req() req: any, @Query('eventoId') eventoId?: string, @Query('tipo') tipo?: string) {
    return this.midiasService.findMidias(req.user.id, eventoId, tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de uma mídia específica' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    return this.midiasService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar informações da mídia (Apenas Equipe Interna)' })
  async updateMidia(@Param('id') id: string, @Body() dto: UpdateMidiaDto) {
    return this.midiasService.updateMidia(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Excluir uma mídia (Apenas Equipe Interna)' })
  async removeMidia(@Param('id') id: string) {
    return this.midiasService.removeMidia(+id);
  }
}
