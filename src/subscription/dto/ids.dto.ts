import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IdsDto {
  @ApiProperty()
  @IsString({ each: true })
  ids: string[];
}
