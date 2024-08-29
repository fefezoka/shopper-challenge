import { ApiPropertyOptional } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';

export class MeasureListRequestDTO {
  @ApiPropertyOptional({ enum: $Enums.MeasureType })
  measure_type?: $Enums.MeasureType;
}
