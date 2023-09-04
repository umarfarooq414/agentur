import { IsEmail, IsNumber, Min, Max } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpRequestDto {
  @Trim()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  @IsNumber()
  @Min(1000)
  @Max(9999)
  @ApiProperty({
    example: 1234,
    description: "4 digits Otp to verify it's you!",
  })
  public readonly otp: number;
}

export class VerifyOtpResponseDto {
  message: string;
  access_token: string;
  constructor(message: string, access_token: string) {
    this.message = message;
    this.access_token = access_token;
  }
}
