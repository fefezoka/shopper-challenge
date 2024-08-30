import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Customer } from '@prisma/client';

export class CustomerEntity implements Customer {
  @ApiProperty()
  customer_code: string;
}
