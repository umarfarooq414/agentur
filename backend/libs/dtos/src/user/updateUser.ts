import { IUser } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserRequestDto implements Partial<IUser> {
  @IsOptional()
  @IsString()
  @MaxLength(30, {
    message: `First Name length must be less than 30`,
  })
  @ApiProperty({ description: 'Leave Empty if not wanted to update!' })
  public readonly firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30, {
    message: `Last Name length must be less than 30`,
  })
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly lastName?: string;
}
