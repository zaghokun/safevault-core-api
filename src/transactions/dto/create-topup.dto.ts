import { IsNumber, Min, IsPositive } from 'class-validator';

export class CreateTopupDto {
  @IsNumber()
  @IsPositive()
  @Min(10000, { message: 'Top up minimal Rp 10.000' })
  amount: number;
}