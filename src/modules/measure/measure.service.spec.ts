import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { GeminiModule } from 'src/modules/gemini/gemini.module';
import { ConfirmRequestDTO } from 'src/modules/measure/dtos/confirm-request.dto';
import { UploadRequestDTO } from 'src/modules/measure/dtos/upload-request.dto';
import { MeasureEntity } from 'src/modules/measure/entities/measure.entity';
import { MeasureModule } from 'src/modules/measure/measure.module';
import { MeasureService } from 'src/modules/measure/measure.service';

const measureRequestDTOMock: UploadRequestDTO = {
  customer_code: '1234',
  image: '',
  measure_datetime: new Date(),
  measure_type: 'WATER',
};

const confirmRequestDTOMock: ConfirmRequestDTO = {
  confirmed_value: 1234,
  measure_uuid: 'uuid',
};

const measureMock: MeasureEntity = {
  customer_code: '1234',
  has_confirmed: false,
  image_url: '',
  measure_datetime: new Date(),
  measure_type: 'WATER',
  measure_uuid: '',
  measure_value: 155,
};

describe('measure service', () => {
  let service: MeasureService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GeminiModule, MeasureModule, PrismaModule],
      providers: [MeasureService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(MeasureService);
    prisma = module.get(PrismaService);
  });

  describe('upload', () => {
    it('retornar erro caso exista uma leitura no mês naquele tipo de leitura', () => {
      prisma.measure.count.mockResolvedValueOnce(1);

      expect(service.upload(measureRequestDTOMock)).rejects.toThrow(
        'Conflict Exception',
      );
    });
  });

  describe('confirm', () => {
    it('retornar erro caso a leitura não seja encontrada', () => {
      prisma.measure.findUnique.mockResolvedValueOnce(null);

      expect(service.confirm(confirmRequestDTOMock)).rejects.toThrow(
        'Not Found Exception',
      );
    });

    it('retornar erro caso a leitura ja tenha sido confirmada', () => {
      prisma.measure.findUnique.mockResolvedValueOnce({
        ...measureMock,
        has_confirmed: true,
      });

      expect(service.confirm(confirmRequestDTOMock)).rejects.toThrow(
        'Conflict Exception',
      );
    });
  });

  describe('list', () => {
    it('retornar erro caso não seja encontrado leituras', () => {
      prisma.measure.findMany.mockResolvedValueOnce([]);

      expect(service.list('123', 'GAS')).rejects.toThrow('Not Found Exception');
    });
  });
});
