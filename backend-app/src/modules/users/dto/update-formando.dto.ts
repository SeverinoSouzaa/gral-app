import { PartialType } from '@nestjs/swagger';
import { CreateFormandoDto } from './create-formando.dto';

export class UpdateFormandoDto extends PartialType(CreateFormandoDto) {}
