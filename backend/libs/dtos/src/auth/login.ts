import { IsString, IsEmail, MinLength } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @Trim()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  @IsString()
  @MinLength(7, {
    message: `Password must be at least 7 characters long`,
  })
  @ApiProperty({
    example: 'password',
    description: 'Password for user. Must be 7 characters long.',
  })
  public readonly password: string;
}
