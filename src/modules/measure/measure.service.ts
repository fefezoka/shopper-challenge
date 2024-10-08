import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { writeFileSync } from 'fs';
import { PrismaService } from 'src/database/prisma.service';
import { ConfirmRequestDTO } from 'src/modules/measure/dtos/confirm-request.dto';
import { UploadRequestDTO } from 'src/modules/measure/dtos/upload-request.dto';
import { UploadResponseDTO } from 'src/modules/measure/dtos/upload-response.dto';
import { MeasureEntity } from 'src/modules/measure/entities/measure.entity';
import { randomUUID } from 'node:crypto';
import { GeminiService } from 'src/modules/gemini/gemini.service';

@Injectable()
export class MeasureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gemini: GeminiService,
  ) {}

  findUnique(measure_uuid: string): Promise<MeasureEntity | null> {
    return this.prisma.measure.findUnique({ where: { measure_uuid } });
  }

  async isMonthMeasurementAlreadyBeenTaken(
    measureType: $Enums.MeasureType,
    customerCode: string,
  ): Promise<boolean> {
    const date = new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const measure = await this.prisma.measure.count({
      where: {
        customer_code: customerCode,
        measure_type: measureType,
        measure_datetime: {
          lte: new Date(currentYear, currentMonth, 31),
          gte: new Date(currentYear, currentMonth, 1),
        },
      },
    });

    return !!measure;
  }

  async upload(uploadRequestDTO: UploadRequestDTO): Promise<UploadResponseDTO> {
    const isMonthMeasurementAlreadyBeenTaken =
      await this.isMonthMeasurementAlreadyBeenTaken(
        uploadRequestDTO.measure_type,
        uploadRequestDTO.customer_code,
      );

    if (isMonthMeasurementAlreadyBeenTaken) {
      throw new ConflictException({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }

    const generatedContent = await this.gemini.generateContent([
      'Qual o valor contido no medidor? Me traga como resposta apenas o valor numérico',
      {
        inlineData: {
          data: uploadRequestDTO.image,
          mimeType: 'image/png',
        },
      },
    ]);

    const measureValue = Number(generatedContent.response.text());

    const baseUrl = 'http:localhost:3000/';
    const imagePath = `public/${randomUUID()}.jpg`;

    writeFileSync(imagePath, uploadRequestDTO.image, {
      encoding: 'base64',
    });

    const createMeasureResponse = await this.prisma.measure.create({
      data: {
        customer: {
          connectOrCreate: {
            create: { customer_code: uploadRequestDTO.customer_code },
            where: {
              customer_code: uploadRequestDTO.customer_code,
            },
          },
        },
        measure_type: uploadRequestDTO.measure_type,
        image_url: baseUrl + imagePath,
        measure_datetime: uploadRequestDTO.measure_datetime,
        measure_value: measureValue,
      },
    });

    return {
      image_url: baseUrl + imagePath,
      measure_value: createMeasureResponse.measure_value,
      measure_uuid: createMeasureResponse.measure_uuid,
    };
  }

  async confirm(confirmRequestDTO: ConfirmRequestDTO) {
    const measure = await this.findUnique(confirmRequestDTO.measure_uuid);

    if (!measure) {
      throw new NotFoundException({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura não encontrada',
      });
    }

    if (measure.has_confirmed) {
      throw new ConflictException({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Confirmação já realizada',
      });
    }

    await this.prisma.measure.update({
      where: {
        measure_uuid: confirmRequestDTO.measure_uuid,
      },
      data: {
        has_confirmed: true,
        measure_value: confirmRequestDTO.confirmed_value,
      },
    });

    return {
      success: true,
    };
  }

  async list(customerCode: string, measureType?: $Enums.MeasureType) {
    const measures = await this.prisma.measure.findMany({
      where: {
        AND: [
          {
            customer_code: customerCode,
          },
          { measure_type: measureType },
        ],
      },
      select: {
        measure_value: true,
        measure_uuid: true,
        measure_type: true,
        measure_datetime: true,
        image_url: true,
        has_confirmed: true,
      },
    });

    if (measures.length === 0) {
      throw new NotFoundException({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    return {
      customer_code: customerCode,
      measures,
    };
  }
}
