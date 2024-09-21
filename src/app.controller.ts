import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { DownloadDto, FormatDto, ConvertToMp3Dto } from './dto/app.dto';
import { Response } from 'express';

@ApiTags('API Endpoints')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('formats')
  @ApiOperation({ summary: 'Get supported formats' })
  @ApiResponse({
    status: 201,
    description: 'Formats retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid URL provided.' })
  @ApiResponse({ status: 500, description: 'Failed to retrieve formats.' })
  getFormats(@Body() formatDto: FormatDto) {
    return this.appService.getFormats(formatDto);
  }

  @Post('download')
  @ApiOperation({ summary: 'Download a file' })
  @ApiResponse({
    status: 201,
    description: 'File download initiated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid YouTube URL or format itag',
  })
  @ApiResponse({ status: 500, description: 'Failed to download video' })
  downloadFile(@Body() downloadDto: DownloadDto, @Res() res: Response) {
    return this.appService.downloadFile(downloadDto, res);
  }

  @Post('convert-to-mp3')
  @ApiOperation({ summary: 'Convert a file to MP3' })
  @ApiResponse({
    status: 201,
    description: 'File conversion to MP3 successful.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid YouTube URL',
  })
  @ApiResponse({ status: 500, description: 'Failed to convert audio' })
  convertToMp3(@Body() convertToMp3Dto: ConvertToMp3Dto, @Res() res: Response) {
    return this.appService.convertToMp3(convertToMp3Dto, res);
  }
}
