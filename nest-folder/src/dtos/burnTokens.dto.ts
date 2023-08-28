import { ApiProperty } from '@nestjs/swagger';

export class burnTokensDTO {
  @ApiProperty({ type: Number, required: true, default: 'Default Burn Amount' })
  amount: number;
}
