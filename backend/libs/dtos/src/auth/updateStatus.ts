import { UserStatusEnum } from '@lib/types';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

ApiProperty();
export class UpdateStatusDto {
  @IsNotEmpty()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Enter user id in Uuid format!',
  })
  userId: string;

  @IsEnum(UserStatusEnum)
  @ApiProperty({
    example: UserStatusEnum.ACTIVE,
    description: 'Enter user status you want to update',
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;
}
