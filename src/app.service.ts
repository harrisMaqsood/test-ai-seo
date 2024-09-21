import { Response } from 'express';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ytdl from '@distube/ytdl-core';
import { Injectable, HttpException } from '@nestjs/common';

import {
  FormatDto,
  DownloadDto,
  FormatResponse,
  ConvertToMp3Dto,
} from './dto/app.dto';

@Injectable()
export class AppService {
  async getFormats(formatDto: FormatDto): Promise<FormatResponse[]> {
    const { url } = formatDto;

    try {
      const info = await ytdl.getInfo(url);
      const formats: FormatResponse[] = info.formats
        .filter((format) => format.qualityLabel)
        .map((format) => ({
          quality: format.qualityLabel,
          itag: format.itag,
        }))
        .reduce((acc, current) => {
          const exists = acc.find((item) => item.quality === current.quality);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

      return formats;
    } catch {
      throw new HttpException('Failed to retrieve formats.', 500);
    }
  }

  async downloadFile(downloadDto: DownloadDto, res: Response): Promise<void> {
    try {
      const { url, itag } = downloadDto;

      const info = await ytdl.getInfo(url);
      const format = ytdl.chooseFormat(info.formats, { quality: itag });

      if (!format) {
        throw new HttpException('Invalid itag or format not available', 400);
      }

      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
      res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
      res.header('Content-Type', 'video/mp4');

      const stream = ytdl(url, {
        format: format,
        requestOptions: {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        },
      });

      stream.pipe(res);

      stream.on('error', () => {
        throw new HttpException('Failed to download video', 500);
      });
    } catch {
      throw new HttpException('Failed to download video', 500);
    }
  }

  async convertToMp3(
    convertToMp3Dto: ConvertToMp3Dto,
    res: Response,
  ): Promise<void> {
    try {
      const { url } = convertToMp3Dto;
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
      res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
      res.header('Content-Type', 'audio/mp3');

      const stream = ytdl(url, {
        quality: 'highestaudio',
        requestOptions: {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        },
      });

      ffmpeg(stream)
        .audioBitrate(128)
        .format('mp3')
        .on('error', () => {
          throw new HttpException('Failed to convert video', 500);
        })
        .pipe(res, { end: true });
    } catch {
      throw new HttpException('Failed to convert video', 500);
    }
  }
}
