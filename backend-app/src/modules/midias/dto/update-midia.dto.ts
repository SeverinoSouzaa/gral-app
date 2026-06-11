import { PartialType, PickType } from '@nestjs/swagger';
import { CreateMidiaDto } from './create-midia.dto';

export class UpdateMidiaDto extends PartialType(
  PickType(CreateMidiaDto, ['titulo', 'altText'] as const)
) {}
