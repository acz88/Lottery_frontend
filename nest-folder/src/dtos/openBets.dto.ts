import { ApiProperty } from '@nestjs/swagger';

export class openBetsDTO {
  @ApiProperty({ type: Number, required: true, default: "Default Closing Time" })
  closingTime: number;
}