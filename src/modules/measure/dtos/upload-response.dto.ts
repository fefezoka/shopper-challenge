import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDTO {
  @ApiProperty()
  image_url: string;

  @ApiProperty()
  measure_uuid: string;

  @ApiProperty()
  measure_value: number;
}
