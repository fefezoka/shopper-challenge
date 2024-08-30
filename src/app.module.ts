import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from 'src/database/prisma.module';
import { MeasureModule } from 'src/modules/measure/measure.module';

@Module({
  imports: [
    MeasureModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public/',
    }),
  ],
})
export class AppModule {}
