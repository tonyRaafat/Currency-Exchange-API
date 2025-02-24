/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jhondoe@example.com', type: String })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd', type: String })
  @IsString()
  password: string;
}
