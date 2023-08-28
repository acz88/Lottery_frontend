import { ApiProperty } from '@nestjs/swagger';

export class wihdrawTokensDTO {
  @ApiProperty({ type: String, required: true, default: 'My Adress' })
  address: string;
  @ApiProperty({ type: Number, required: true, default: 'Default Withdraw Amount' })
  amount: number;
}