import { ApiProperty } from '@nestjs/swagger';
import { MeasureEntity } from 'src/modules/measure/entities/measure.entity';

export class MeasureListResponseDTO {
  @ApiProperty()
  customer_code: string;

  @ApiProperty({ type: MeasureEntity, isArray: true })
  measures: MeasureEntity[];
}
