import { IsEmail } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetRequestDto {
  @Trim()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;
}
