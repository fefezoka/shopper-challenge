import { ApiProperty } from '@nestjs/swagger';
import { Measure, $Enums } from '@prisma/client';

export class MeasureEntity implements Measure {
  @ApiProperty()
  customer_code: string;

  @ApiProperty()
  has_confirmed: boolean;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  measure_datetime: Date;

  @ApiProperty({ enum: $Enums.MeasureType })
  measure_type: $Enums.MeasureType;

  @ApiProperty()
  measure_uuid: string;

  @ApiProperty()
  measure_value: number;
}
