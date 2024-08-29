import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { MeasureModule } from 'src/modules/measure/measure.module';

@Module({
  imports: [MeasureModule, PrismaModule],
})
export class AppModule {}
