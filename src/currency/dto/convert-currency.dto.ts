import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class ConvertCurrencyDto {
  @ApiProperty({
    description: 'The source currency code (ISO 4217)',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  fromCurrency: string;

  @ApiProperty({
    description: 'The target currency code (ISO 4217)',
    example: 'EUR',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  toCurrency: string;

  @ApiProperty({
    description: 'The amount to convert',
    example: 100.5,
    minimum: 0,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Amount must be a number with maximum 2 decimal places' },
  )
  @Min(0, { message: 'Amount must be greater than or equal to 0' })
  @IsNotEmpty()
  amount: number;
}
