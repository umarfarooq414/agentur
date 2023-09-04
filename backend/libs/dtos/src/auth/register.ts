import { IUser, UserRoleEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';

import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto implements IUser {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: `Username length must be less than 30`,
  })
  @ApiProperty({ example: 'john123', description: 'userName must be unique!' })
  public readonly userName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: `First Name length must be less than 30`,
  })
  @ApiProperty({ example: 'John', description: 'First Name of user' })
  public readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30, {
    message: `Last Name length must be less than 30`,
  })
  @ApiProperty({ example: 'Smith', description: 'Last Name of user' })
  public readonly lastName: string;

  @Trim()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.smith@demo.com',
    description: 'Email of the user',
  })
  public readonly email: string;

  public readonly role?: UserRoleEnum;

  @IsNotEmpty()
  @IsString()
  @MinLength(7, {
    message: `Password must be at least 7 characters long`,
  })
  @ApiProperty({
    example: 'password',
    description: 'Password for user. Must be 7 characters long.',
  })
  password: string;
}
