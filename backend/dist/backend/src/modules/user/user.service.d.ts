import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserRoleEnum } from '@lib/types';
import { AuthHelper } from '../auth/auth.helper';
import { UpdateUserRequestDto } from '@lib/dtos';
import { UpdateDocumentStatusDto, UploadContractDto } from '@lib/dtos/project/uploadContract';
import { CloudinaryConfigService } from '@config/cloudinaryConfig';
import { Documents } from './entities/document.entity';
export declare class UserService {
    private userRepository;
    private documentRepository;
    private config;
    private readonly helper;
    private cloudinary;
    constructor(userRepository: Repository<User>, documentRepository: Repository<Documents>, config: ConfigService, helper: AuthHelper, cloudinary: CloudinaryConfigService);
    createAdmin(): Promise<void>;
    getAllUsers(token: string): Promise<User[]>;
    getAllActiveUsers(role: UserRoleEnum): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    getMultiUserById(id: string[]): Promise<string[]>;
    updateUser(body: UpdateUserRequestDto, id: string): Promise<User>;
    uploadContract(token: string, file: any, body: UploadContractDto): Promise<Documents>;
    updateDocumentStatus(token: string, body: UpdateDocumentStatusDto): Promise<Documents>;
    getDocuments(userId: string): Promise<Documents[]>;
    uploadDocuments(id: string, files: any): Promise<void>;
}
