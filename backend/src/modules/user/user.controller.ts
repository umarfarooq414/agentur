/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  Headers,
  UploadedFile,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SWAGGER_API_TAG } from '@lib/constants/swagger';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import {
  GlobalResponseDto,
  ResetPasswordRequestDto,
  UpdateUserRequestDto,
} from '@lib/dtos';
import { AuthService } from '../auth/auth.service';
import {
  UpdateDocumentStatusDto,
  UploadContractDto,
  UploadDocumentsDto,
} from '@lib/dtos/project/uploadContract';
import { UserRole, UserRoleEnum } from '@lib/types';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('user')
@ApiTags(SWAGGER_API_TAG.USER)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  // @UserRole(UserRoleEnum.ADMIN)
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  async approveUser(
    @Headers() token: { authorization: string },
  ): Promise<User[]> {
    return await this.userService.getAllUsers(token.authorization);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Please enter user id in Uuid format!',
    type: 'string',
  })
  @Get('id/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('user-by-token')
  async getUserByToken(@CurrentUser('id') id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('update')
  async updateUser(
    @Body() body: UpdateUserRequestDto,
    @CurrentUser('id') id: string,
  ): Promise<User> {
    return await this.userService.updateUser(body, id);
  }

  @Put('update-password')
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully!',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  resetPassword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
    @CurrentUser('email') email: string,
  ): Promise<GlobalResponseDto> {
    return this.authService.resetPassword(resetPasswordRequestDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload Contract' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('contract'))
  @Post('uploadContract')
  async uploadContract(
    @Headers('authorization') token: string,
    @UploadedFile() file,
    @Body() body: UploadContractDto,
  ) {
    return this.userService.uploadContract(token, file, body);
  }

  @UseGuards(JwtAuthGuard)
  @UserRole(UserRoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Document Status' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put('updateDocument')
  async updateDocumentStatus(
    @Headers('authorization') token: string,
    @Body() body: UpdateDocumentStatusDto,
  ) {
    return this.userService.updateDocumentStatus(token, body);
  }

  @ApiOperation({ summary: 'All Documents of a User' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('getDocuments')
  async getDocuments(@Query('userId') userId: string) {
    return this.userService.getDocuments(userId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'contract' },
      { name: 'idFront' },
      { name: 'idBack' },
      { name: 'selfie' },
    ]),
  )
  @Post('uploadDocuments')
  @ApiOperation({ summary: 'Upload Documents' })
  @ApiResponse({
    status: 201,
    description: 'Documents Uploaded!',
  })
  async uploadDocuments(
    @Body() { userId }: UploadDocumentsDto,
    @UploadedFiles() files,
  ) {
    return await this.userService.uploadDocuments(userId, files);
  }
}
