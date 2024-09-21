import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FormatDto {
  @ApiProperty({
    example:
      'https://www.youtube.com/watch?v=SMs0GnYze34&pp=ygUPbGV0IG1lIGxvdmUgeW91',
  })
  @IsNotEmpty()
  @IsString()
  url: string;
}

export type FormatResponse = {
  quality: string;
  itag: number;
};

export class DownloadDto {
  @ApiProperty({
    example:
      'https://www.youtube.com/watch?v=SMs0GnYze34&pp=ygUPbGV0IG1lIGxvdmUgeW91',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  itag: number;
}

export class ConvertToMp3Dto {
  @ApiProperty({
    example:
      'https://www.youtube.com/watch?v=SMs0GnYze34&pp=ygUPbGV0IG1lIGxvdmUgeW91',
  })
  @IsNotEmpty()
  @IsString()
  url: string;
}
