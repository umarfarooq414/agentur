import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
export class UpdateProjectRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly projectName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly projectInfo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Leave Empty if not wanted to update' })
  public readonly projectCompensation?: string;

  @IsOptional()
  @ApiProperty({ description: 'upload image to update' })
  public readonly image?: string;
}
