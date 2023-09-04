import { DocumentNameEnum, DocumentStatusEnum } from '@lib/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class UploadContractDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user id to upload contract' })
  public readonly userId: string;

  @IsNotEmpty()
  @IsEnum(DocumentNameEnum)
  @ApiProperty({ description: 'document name to upload contract' })
  public readonly name: DocumentNameEnum;
}

export class UpdateDocumentStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user id to update status' })
  public readonly userId: string;

  @IsNotEmpty()
  @IsEnum(DocumentStatusEnum)
  @ApiProperty({ description: 'status of the document' })
  public readonly status: DocumentStatusEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'document id to update status' })
  public readonly documentId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'rejection reason to update status' })
  public readonly reason: string;
}

export class UploadDocumentsDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'user id to upload documents' })
  public readonly userId: string;
}
