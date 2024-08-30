import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBase64, IsDateString, IsEnum, IsString } from 'class-validator';
import { $Enums } from '@prisma/client';

export class UploadRequestDTO {
  @ApiProperty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.replace(/^data:image\/[a-z]+;base64,/, '');
    }
    return value;
  })
  @IsBase64()
  image: string;

  @ApiProperty()
  @IsString()
  customer_code: string;

  @ApiProperty()
  @IsDateString()
  measure_datetime: Date;

  @ApiProperty({ enum: $Enums.MeasureType })
  @Transform(({ value }) => ('' + value).toUpperCase())
  @IsEnum($Enums.MeasureType)
  measure_type: $Enums.MeasureType;
}
