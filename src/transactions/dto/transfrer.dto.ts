import { IsNumber, IsString, IsNotEmpty, Min, IsPositive, Length, IsOptional } from "class-validator";

export class TransferDto{
    @IsString()
    @IsNotEmpty()
    toWalletId: string;

    @IsNumber()
    @IsPositive()
    @Min(10000)
    amount: number;

    @IsString()
    @Length(6, 6, { message: 'PIN harus 6 digit'})
    pin: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    idempotencyKey?: string;
}