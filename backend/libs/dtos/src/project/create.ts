import { IProject } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

// class Users {
//   @IsNotEmpty()
//   @IsString()
//   @ApiProperty({ example: '123457', description: 'User id here here' })
//   id: string;
// }
export class CreateProjectRequestDto implements IProject {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'My Project', description: 'Project Info' })
  public readonly projectName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'project info here',
    description: 'detailed info here',
  })
  public readonly projectInfo: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'project compensation here',
    description: 'detailed compensation here',
  })
  public readonly projectCompensation: string;

  @ApiProperty({
    example: 'image',
    description: 'image ur; here',
  })
  public image: string;

  @ApiProperty({
    // type: [Users],
    description: 'Array of User IDs',
  })
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Users)
  userIds: string[];
}
