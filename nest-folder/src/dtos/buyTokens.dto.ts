import { ApiProperty } from '@nestjs/swagger';

export class buyTokensDTO {
  @ApiProperty({ type: Number, required: true, default: 'Default Buy Amount' })
  value: number;
}