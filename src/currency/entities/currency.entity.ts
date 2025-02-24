import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsMongoId } from 'class-validator';

export type CurrencyDocument = Currency & Document;

@Schema({ timestamps: true })
export class Currency {
  @ApiProperty({
    description: 'The currency conversion ID',
    example: '507f1f77bcf86cd799439011',
  })
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'The ID of the user who made the conversion',
    example: '507f1f77bcf86cd799439012',
  })
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    description: 'The source currency code (e.g., USD)',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  fromCurrency: string;

  @ApiProperty({
    description: 'The target currency code (e.g., EUR)',
    example: 'EUR',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  toCurrency: string;

  @ApiProperty({
    description: 'The amount to convert',
    example: 100.5,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  amount: number;

  @ApiProperty({
    description: 'The converted amount',
    example: 92.46,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  convertedAmount: number;

  @ApiProperty({
    description: 'The conversion rate',
    example: 0.92,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  rate: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
