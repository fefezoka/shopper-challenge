import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class ConfirmRequestDTO {
  @ApiProperty()
  @IsUUID()
  measure_uuid: string;

  @ApiProperty()
  @IsNumber()
  confirmed_value: number;
}
