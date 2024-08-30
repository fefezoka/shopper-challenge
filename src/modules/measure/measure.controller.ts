import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MeasureService } from './measure.service';
import { ApiResponse } from '@nestjs/swagger';
import { UploadResponseDTO } from 'src/modules/measure/dtos/upload-response.dto';
import { UploadRequestDTO } from 'src/modules/measure/dtos/upload-request.dto';
import { ConfirmRequestDTO } from 'src/modules/measure/dtos/confirm-request.dto';
import { MeasureListRequestDTO } from 'src/modules/measure/dtos/measure-list-request.dto';
import { MeasureListResponseDTO } from 'src/modules/measure/dtos/measure-list-response.dto';

@Controller()
export class MeasureController {
  constructor(private readonly measureService: MeasureService) {}

  @Post('upload')
  @ApiResponse({
    status: 200,
    description: 'Operação realizada com sucesso',
    type: UploadResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Os dados fornecidos no corpo da requisição são inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma leitura para este tipo no mês atual',
  })
  upload(@Body() uploadRequestDTO: UploadRequestDTO) {
    return this.measureService.upload(uploadRequestDTO);
  }

  @Patch('confirm')
  @ApiResponse({ status: 200, description: 'Operação realizada com sucesso' })
  @ApiResponse({
    status: 400,
    description: 'Os dados fornecidos no corpo da requisição são inválidos',
  })
  @ApiResponse({ status: 404, description: 'Leitura não encontrada ' })
  @ApiResponse({ status: 409, description: 'Leitura já confirmada ' })
  async confirm(@Body() confirmRequestDTO: ConfirmRequestDTO) {
    return this.measureService.confirm(confirmRequestDTO);
  }

  @Get(':customer_code/list')
  @ApiResponse({
    status: 200,
    description: 'Operação realizada com sucesso',
    type: MeasureListResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetro measure type diferente de WATER ou GAS',
  })
  @ApiResponse({ status: 404, description: 'Nenhum registro encontrado ' })
  async measureList(
    @Param('customer_code') customerCode: string,
    @Query() measureListRequestDTO: MeasureListRequestDTO,
  ) {
    return this.measureService.list(
      customerCode,
      measureListRequestDTO.measure_type,
    );
  }
}
