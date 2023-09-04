import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SocialProviderEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
export class SocialLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'Access Token for user. Must be a valid access token.',
  })
  accessToken: string;

  @IsNotEmpty()
  @IsEnum(SocialProviderEnum)
  @ApiProperty({
    example: 'google',
    description: 'Must provide a SocialProvider',
  })
  socialProvider: SocialProviderEnum;
}
