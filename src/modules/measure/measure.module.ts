import { Module } from '@nestjs/common';
import { MeasureService } from './measure.service';
import { MeasureController } from './measure.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { GeminiModule } from 'src/modules/gemini/gemini.module';

@Module({
  imports: [PrismaModule, GeminiModule],
  controllers: [MeasureController],
  providers: [MeasureService],
})
export class MeasureModule {}
